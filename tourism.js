let data;
function init(){
axios.get('https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json')
  .then(function (response) {
  
    data = response.data;
    renderC3();
    render();
    
  });
}

init();

//Level 1
const list = document.querySelector(".ticketCard-area");


function render(location){
  let str = "";
  
//data.data 符合資料格式
  const cacheData = data.filter(function (item){
    if (location === item.area){
      return item;
    }
    if (!location){   
      return item;
    }
  })
  cacheData.forEach(function (item){
    str += `<li class="ticketCard">
        <div class="ticketCard-img">
          <a href="#">
            <img src="${item.imgUrl}" alt="">
          </a>
          <div class="ticketCard-region">${item.area}</div>
          <div class="ticketCard-rank">${item.rate}</div>
        </div>
        <div class="ticketCard-content">
          <div>
            <h3>
              <a href="#" class="ticketCard-name">${item.name}</a>
            </h3>
            <p class="ticketCard-description">
              ${item.description}
            </p>
          </div>
          <div class="ticketCard-info">
            <p class="ticketCard-num">
              <span><i class="fas fa-exclamation-circle"></i></span>
              剩下最後 <span id="ticketCard-num"> ${item.group} </span> 組
            </p>
            <p class="ticketCard-price">
              TWD <span id="ticketCard-price">$${item.price}</span>
            </p>
          </div>
        </div>
      </li>`;
  })
  
  //篩選後找到幾筆資料-
  let searchNum = cacheData.length;
  const searchResult = document.querySelector('#searchResult-text');
  searchResult.innerHTML = `本次搜尋共 ${searchNum} 筆資料`;
  
list.innerHTML = str;
}

function renderC3(){
  // 篩選地區，並累加數字上去
  // totalObj 會變成 {高雄: 1, 台北: 1, 台中: 1}
  let totalObj = {};
  data.forEach(function(item,index){
    if(totalObj[item.area]==undefined){
      totalObj[item.area] = 1;
    }else{
       totalObj[item.area] +=1;
    }
  })
  
  // newData = [["高雄", 2], ["台北",1], ["台中", 1]]
  let newData = [];
  let area = Object.keys(totalObj);
  // area output ["高雄","台北","台中"]
  
  area.forEach(function(item,index){
    let ary = [];
    ary.push(item);
    ary.push(totalObj[item]);
    newData.push(ary);
  })
  
  // 將 newData 丟入 c3 產生器
  const chart = c3.generate({
    bindto: ".donutChart",
    data: {
      columns: newData,
      type : 'donut',
    },
    donut:{
 title: '地區', // 圖表名稱
 label: {
  show: false // 標籤不顯示
 },
 width: 25, // 資料圈圈寬度（為%數）
 },
size : { // 大小
 height : 160,
 width : 160
}
  });

}



//Level 3
const addBtn = document.querySelector(".addTicket-btn");

const name = document.querySelector("#ticketName");
const imagUrl = document.querySelector("#ticketImgUrl");
const area = document.querySelector('#ticketRegion');
const price = document.querySelector('#ticketPrice');
const groupNum = document.querySelector('#ticketNum');
const rate = document.querySelector('#ticketRate');
const description = document.querySelector('#ticketDescription');

function addCard() {
  //簡單防呆
  if(name.value === '' || imagUrl.value === '' || area.value === '' || price.value === '' || groupNum.value === '' || rate.value === '' || description.value === ''){
    alert('請輸入完整資訊哦~');
  }else{
    if( Number(rate.value)<1 ||  Number(rate.value)>10){
      alert('星級區間是 1-10 分哦~');
    }else{
      //data.data符合資料格式
      data.push({
    id: Date.now(),          //取得現在時間，確保不會重複，拿來當辨識碼
    name: name.value,        //value -> 取出使用者輸入進去的值
    imgUrl: imagUrl.value,
    area: area.value,
    price: Number(price.value),
    group: Number(groupNum.value),
    rate: Number(rate.value),
    description: description.value,
  })
  
  const form = document.querySelector('.addTicket-form');
  form.reset(); 

  renderC3();
  render();
      
  //新增資料之後將篩選選項回到「全部地區」，更符合顯示的結果
  areaSelect.value = '';
    }
  }
  
}

addBtn.addEventListener('click', addCard);

//篩選地區option 台北 台中 高雄
const areaSelect = document.querySelector('.regionSearch');
areaSelect.addEventListener('change', filter);

function filter(){
  render(areaSelect.value);
}
