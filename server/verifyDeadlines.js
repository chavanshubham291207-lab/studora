async function verifyType(type) {
  try {
    const res = await fetch(`http://localhost:5000/api/opportunities?type=${type}`);
    if (!res.ok) {
      console.error(`Failed to fetch ${type}: status ${res.status}`);
      return false;
    }
    const data = await res.json();
    console.log(`\n--- Verification for ${type} (Count: ${data.length}) ---`);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let previousDeadline = null;
    let allValid = true;

    data.forEach((opp, index) => {
      const deadlineDate = new Date(opp.deadline);
      const daysRemaining = (deadlineDate - today) / 86400000;
      
      console.log(`[${index}] "${opp.title}" by ${opp.company || opp.provider} | Deadline: ${opp.deadline} (${daysRemaining.toFixed(1)} days remaining)`);

      // 1. Check >= 10 days remaining
      if (daysRemaining < 10) {
        console.error(`❌ Error: Deadline is too near (< 10 days remaining)`);
        allValid = false;
      }

      // 2. Check < 90 days remaining
      if (daysRemaining >= 90) {
        console.error(`❌ Error: 90+ days remaining listing should have been filtered out`);
        allValid = false;
      }

      // 3. Check ascending order sorting
      if (previousDeadline && deadlineDate < previousDeadline) {
        console.error(`❌ Error: Not sorted correctly (Current: ${opp.deadline} is before Previous: ${previousDeadline.toISOString().split('T')[0]})`);
        allValid = false;
      }
      
      previousDeadline = deadlineDate;
    });

    if (allValid && data.length > 0) {
      console.log(`✅ All checks passed for ${type}!`);
      return true;
    } else if (data.length === 0) {
      console.warn(`⚠️ Warning: No opportunities of type ${type} returned`);
      return false;
    }
    return false;
  } catch (err) {
    console.error(`Connection error verifying ${type}:`, err.message);
    return false;
  }
}

async function runAll() {
  const t1 = await verifyType('internship');
  const t2 = await verifyType('scholarship');
  const t3 = await verifyType('hackathon');
  if (t1 && t2 && t3) {
    console.log('\n🌟 Dynamic Rolling Deadlines & Sorting Verification successful!');
  } else {
    console.error('\n❌ Verification failed.');
  }
}

runAll();
