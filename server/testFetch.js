async function test() {
  try {
    const res = await fetch('http://localhost:5000/api/opportunities?type=internship');
    if (res.ok) {
      const data = await res.json();
      console.log('Total Internships loaded:', data.length);
      console.log('Sample internship fields:', {
        title: data[0].title,
        company: data[0].company,
        provider: data[0].provider,
        stipend: data[0].stipend,
        duration: data[0].duration,
        skills: data[0].skills,
        openings: data[0].openings,
        website: data[0].website
      });
      
      const googleRes = await fetch('http://localhost:5000/api/opportunities?type=internship&company=Google');
      const googleData = await googleRes.json();
      console.log('Google Internships count:', googleData.length);

      const pythonRes = await fetch('http://localhost:5000/api/opportunities?type=internship&skills=Python');
      const pythonData = await pythonRes.json();
      console.log('Python Internships count:', pythonData.length);
    } else {
      console.log('Response not ok:', res.status);
    }
  } catch (err) {
    console.error('Error fetching API:', err.message);
  }
}

test();
