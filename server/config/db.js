const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

let dbMode = 'json'; // default to json fallback
const JSON_DIR = path.join(__dirname, '..', 'data');

// Ensure JSON directory exists
if (!fs.existsSync(JSON_DIR)) {
  fs.mkdirSync(JSON_DIR, { recursive: true });
}

// Helper to read and write local JSON database files
const readJsonFile = (collectionName) => {
  const filePath = path.join(JSON_DIR, `${collectionName.toLowerCase()}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error(`Error reading ${collectionName} JSON file:`, error);
    return [];
  }
};

const writeJsonFile = (collectionName, data) => {
  const filePath = path.join(JSON_DIR, `${collectionName.toLowerCase()}.json`);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${collectionName} JSON file:`, error);
  }
};

// Connect to MongoDB if possible
const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.warn('\n⚠️  [DATABASE WARNING]: MONGODB_URI is not set in environment variables.');
    console.warn('⚙️  [DATABASE FALLBACK]: Using local JSON files in "server/data/" as database.\n');
    dbMode = 'json';
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000 // wait 3s max
    });
    dbMode = 'mongodb';
    console.log('\n🚀 [DATABASE SUCCESS]: Connected to MongoDB successfully.\n');
  } catch (err) {
    console.warn('\n⚠️  [DATABASE WARNING]: Failed to connect to MongoDB:', err.message);
    console.warn('⚙️  [DATABASE FALLBACK]: Using local JSON files in "server/data/" as database.\n');
    dbMode = 'json';
  }
};

// Generic JSON Model adapter that mimics mongoose operations
const createJsonModel = (name) => {
  return {
    find: async (query = {}) => {
      const items = readJsonFile(name);
      return items.filter(item => {
        for (let key in query) {
          if (query[key] !== undefined) {
            // Support simple text/exact match or array contains
            if (Array.isArray(item[key])) {
              if (!item[key].includes(query[key])) return false;
            } else if (item[key] !== query[key]) {
              if (key === 'isApproved' && query[key] === true && item[key] === undefined) {
                continue;
              }
              return false;
            }
          }
        }
        return true;
      });
    },

    findOne: async (query = {}) => {
      const items = readJsonFile(name);
      return items.find(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] !== query[key]) return false;
        }
        return true;
      }) || null;
    },

    findById: async (id) => {
      const items = readJsonFile(name);
      return items.find(item => item._id === id || item.id === id) || null;
    },

    create: async (data) => {
      const items = readJsonFile(name);
      const newItem = {
        _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      items.push(newItem);
      writeJsonFile(name, items);
      return newItem;
    },

    findByIdAndUpdate: async (id, updateData, options = {}) => {
      const items = readJsonFile(name);
      const index = items.findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      
      const updatedItem = {
        ...items[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      items[index] = updatedItem;
      writeJsonFile(name, items);
      return updatedItem;
    },

    findByIdAndDelete: async (id) => {
      const items = readJsonFile(name);
      const index = items.findIndex(item => item._id === id || item.id === id);
      if (index === -1) return null;
      const deletedItem = items[index];
      const filtered = items.filter(item => item._id !== id && item.id !== id);
      writeJsonFile(name, filtered);
      return deletedItem;
    },

    countDocuments: async (query = {}) => {
      const items = readJsonFile(name);
      return items.filter(item => {
        for (let key in query) {
          if (query[key] !== undefined && item[key] !== query[key]) {
            if (key === 'isApproved' && query[key] === true && item[key] === undefined) {
              continue;
            }
            return false;
          }
        }
        return true;
      }).length;
    }
  };
};

// Define Mongoose Schemas & Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  avatar: String,
  bookmarks: { type: [String], default: [] },
  registeredEvents: { type: [String], default: [] },
  wonCompetitions: { type: [String], default: [] },
  reminders: { type: [String], default: [] },
  attendance: { type: Array, default: [] },
  cgpa: { type: Object, default: { semesters: [], cgpa: 0 } },
  timetable: { type: Array, default: [] },
  achievements: { type: Array, default: [] },
  certificates: { type: Array, default: [] },
  progress: { type: Object, default: { profileComplete: 20 } },
  completedCourses: { type: [String], default: [] },
  bookmarkedCourses: { type: [String], default: [] },
  learningStreak: { type: Number, default: 0 },
  lastActiveDate: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const UserMongo = mongoose.models.User || mongoose.model('User', userSchema);

const opportunitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: String,
  provider: String,
  amount: String,
  educationLevel: String,
  documents: { type: [String], default: [] },
  isGovernment: { type: Boolean, default: false },
  scholarshipType: String,
  platform: { type: String, default: 'Unstop' },
  stipend: String,
  duration: String,
  skills: { type: [String], default: [] },
  openings: { type: Number, default: 1 },
  website: String,
  type: { type: String, enum: ['hackathon', 'scholarship', 'internship', 'job', 'course'], required: true },
  description: String,
  eligibility: String,
  deadline: String,
  applyLink: String,
  logo: String,
  tags: [String],
  banner: String,
  mode: { type: String, enum: ['online', 'offline', 'hybrid'], default: 'online' },
  location: String,
  eventDates: String,
  prizePool: String,
  teamSize: String,
  regFee: { type: String, enum: ['free', 'paid'], default: 'free' },
  regFeeAmount: { type: Number, default: 0 },
  category: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  technologies: [String],
  country: String,
  state: String,
  college: String,
  isFeatured: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: true },
  submittedBy: String,
  publishDate: String,
  registrations: { type: [String], default: [] },
  reviews: { type: Array, default: [] },
  discussions: { type: Array, default: [] },
  teamFinder: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const OpportunityMongo = mongoose.models.Opportunity || mongoose.model('Opportunity', opportunitySchema);

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: String,
  time: String,
  venue: String,
  speaker: String,
  registrationLink: String,
  tags: [String],
  rsvps: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const EventMongo = mongoose.models.Event || mongoose.model('Event', eventSchema);

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: String,
  type: { type: String, enum: ['note', 'pyq', 'syllabus', 'pdf', 'playlist'], required: true },
  link: String,
  uploaderName: String,
  uploaderId: String,
  createdAt: { type: Date, default: Date.now }
});

const ResourceMongo = mongoose.models.Resource || mongoose.model('Resource', resourceSchema);

const discussionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  authorName: String,
  authorId: String,
  type: { type: String, enum: ['discussion', 'teammate_search'], default: 'discussion' },
  tags: [String],
  comments: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

const DiscussionMongo = mongoose.models.Discussion || mongoose.model('Discussion', discussionSchema);

const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: String,
  category: { type: String, required: true },
  description: String,
  skills: { type: [String], default: [] },
  duration: String,
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  isFreeCertificate: { type: Boolean, default: true },
  isVirtualExperience: { type: Boolean, default: false },
  provider: { type: String, required: true },
  courseLink: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  completions: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const CertificationMongo = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);

// Mongoose model operations mapped to match our unified API interface
const wrapMongoModel = (MongoModel) => {
  return {
    find: async (query = {}) => {
      // Convert query key strings to regex if they are simple matches or regex search
      return await MongoModel.find(query);
    },
    findOne: async (query = {}) => {
      return await MongoModel.findOne(query);
    },
    findById: async (id) => {
      return await MongoModel.findById(id);
    },
    create: async (data) => {
      return await MongoModel.create(data);
    },
    findByIdAndUpdate: async (id, updateData) => {
      return await MongoModel.findByIdAndUpdate(id, updateData, { new: true });
    },
    findByIdAndDelete: async (id) => {
      return await MongoModel.findByIdAndDelete(id);
    },
    countDocuments: async (query = {}) => {
      return await MongoModel.countDocuments(query);
    }
  };
};

// Export Unified Models
module.exports = {
  connectDB,
  get dbMode() { return dbMode; },
  get User() { return dbMode === 'mongodb' ? wrapMongoModel(UserMongo) : createJsonModel('User'); },
  get Opportunity() { return dbMode === 'mongodb' ? wrapMongoModel(OpportunityMongo) : createJsonModel('Opportunity'); },
  get Event() { return dbMode === 'mongodb' ? wrapMongoModel(EventMongo) : createJsonModel('Event'); },
  get Resource() { return dbMode === 'mongodb' ? wrapMongoModel(ResourceMongo) : createJsonModel('Resource'); },
  get Discussion() { return dbMode === 'mongodb' ? wrapMongoModel(DiscussionMongo) : createJsonModel('Discussion'); },
  get Certification() { return dbMode === 'mongodb' ? wrapMongoModel(CertificationMongo) : createJsonModel('Certification'); }
};
