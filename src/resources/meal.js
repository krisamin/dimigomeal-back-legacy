const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

const { mealModel } = require('../schemas/meal');

const getMealList = async () => {
  const response = await axios.get('https://www.dimigo.hs.kr/index.php?mid=school_cafeteria');
  const $ = cheerio.load(response.data);

  let rowList = [];
  const $rowList = $("#siLst thead th");
  for(const [, th] of $rowList.toArray().entries()) {
    rowList.push($(th).text().replace(/\n/g, "").trim());
  }

  let col = [];
  const $colList = $("#siLst tbody tr");
  for(const [, tr] of $colList.toArray().entries()) {
    let $col = $(tr);
    let trList = [];
    for(const [index, td] of $col.find("td").toArray().entries()) {
      trList[rowList[index]] = $(td).text().replace(/\n/g, " ").trim().replace(/<(?:.|\n)*?>/gm, '');
    }
    trList["주소"] = $col.find(".title a").attr("href");
    col.push(trList);
  };

  return col;
}

const getMealDetail = async (url) => {
  const response = await axios.get(url);

  const $ = cheerio.load(response.data);
  const $mealList = $(".scConDoc").text().split("\n");

  let meal = ["","",""];
  for(let $meal of $mealList) {
    $meal = $meal.replace(/<(?:.|\n)*?>/gm, '').replace(/\t/g, "").replace(/ /g, "").replace("*","");
    if($meal != "" && $meal !== undefined) {
      let type = $meal.split(":")[0];
      let item = $meal.split(":")[1];
      if(item !== undefined) {
        meal[["조식", "중식", "석식"].indexOf(type.substr(0, 2))] = item.trim();
      }
    }
  }

  return meal;
}

const updateMeal = async () => {
  console.log('Fetching meal list...');
  const mealList = await getMealList();
  console.log('Fetching meal list OK');

  let list = [];
  for(const meal of mealList) {
    let data = {};
    data.id = meal['번호'] * 1;
    const splittedTitle = meal['제목'].split("월");
    data.year = moment().year();
    data.month = splittedTitle[0].replace(/[^0-9]/g, "");
    data.day = splittedTitle[1].replace(/[^0-9]/g, "");

    data.month *= 1; data.day *= 1;
    if(!isNaN(data.month) && !isNaN(data.day)) {
      if(moment().month() - data.month >= 3) {
        data.year += 1;
      }
      if(moment().month() - data.month <= -3) {
        data.year -= 1;
      }

      data.date = moment(data.year + "-" + data.month + "-" + data.day, "YYYY-MM-DD").format("YYYY-MM-DD");

      console.log("Getting meal detail of " + meal['번호']);
      const mealDetail = await getMealDetail(meal['주소']);
      data.meal = {};
      data.meal.breakfast = mealDetail[0];
      data.meal.lunch = mealDetail[1];
      data.meal.dinner = mealDetail[2];
      console.log("Getting meal detail of " + meal['번호'] + " OK");
  
      list.push(data);
    }
  }

  for(const meal of list) {
    await mealModel.findOneAndUpdate({
      id: meal.id
    }, {
      $set: {
        date: meal.date,
        breakfast: meal.meal.breakfast,
        lunch: meal.meal.lunch,
        dinner: meal.meal.dinner
      }
    }, {
      upsert: true
    });
  }

  console.log(list);
};

module.exports = {
  updateMeal
};