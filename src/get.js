const fs = require('fs').promises;
const path = require('path');

async function getLinks() {
  const filePath = path.join(__dirname, 'links2023.json');
  const filePath2 = path.join(__dirname, 'linkscurrentyear.json');

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const data2 = await fs.readFile(filePath2, 'utf-8');
    const x = JSON.parse(data);
    const y = JSON.parse(data2);
    const alllinks = [...y, ...x];

    // console.log(alllinks.length);
    // console.log({
    //   Till2023: x.length,
    //   Links2024: y.length
    // })
    return alllinks;
    // return JSON.parse(data);
  } catch (error) {
    console.error('Error reading links.json:', error);
    return [];
  }
}

// (async () => {
//   console.log(await getLinks())
// })()

// 'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12635&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12624&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12623&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12622&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12621&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12620&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12619&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12618&Mode=0',
//   'https://rbi.org.in/Scripts/NotificationUser.aspx?Id=12617&Mode=0',

module.exports = { getLinks };