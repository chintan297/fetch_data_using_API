var rows = document.getElementById("table");
const form1 = document.getElementById("form");
const submitBtn = document.getElementById("submit");
const id = document.getElementById("id");
const userId = document.getElementById("userId");
const title = document.getElementById("title");
var comp = document.getElementsByName("Completed");
const editBtn = document.getElementById("edit");
const s = document.getElementById("searchDiv");

var isEdit;
let arrayOfData = [];
let def = true;
let isAscending = true;
const basedUrl = "https://jsonplaceholder.typicode.com/todos";

// fetch data
async function fetchData() {
  const response = await fetch(`${basedUrl}`);
  const data = await response.json();
  // console.log(data)
  Object.assign(arrayOfData, data);

  if (arrayOfData) {
    handleData(arrayOfData);
  }
}

fetchData();
// handel data in table
function handleData(data) {
  s.innerHTML = `
  <b>Search bar : </b>
  <input type="text" id="searchText" onkeyup="handelSearchKey(event)" placeholder="Search title" />
  <button id="searchBtn" onclick="handleSearch()" >Search</button>
  <button id="searchReset" onclick="handleReset()">Reset Search</button>
  `;
  rows.innerHTML = ` <tr>
         <th>Id</th>
         <th>userId</th>
         <th>title
         <button id="sortBtn" onclick="handleSort()" style="float:right">
         ${def ? "Sort" : isAscending ? " ▲ [ z-a ] " : " ▼ [ a-z ] "}
         </button></th>
         <th>completed</th>
         <th>Action</th>
       </tr>`;
  for (let d of data) {
    rows.innerHTML += ` <tr>
             <td>${d.id}</td>
             <td>${d.userId}</td>
             <td>${d.title}</td>
             <td>${d.completed}</td>
             <td value="${d.id}">
             <button id="edit" onclick="handleEdit(this)" value="${d.id}">Edit</button>
             <button id="delete" onclick="handleDelete(this)" value="${d.id}">Delete</button>
             </td>
           </tr>`;
  }
}

// handel sorting
let isSorted = true;
var sortData = [];
const handleSort = () => {
  // console.log(arrayOfData);

  def = false;
  if (isSorted) {
    arrayOfData.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }
    });
    ssData.sort(function (a, b) {
      if (a.title < b.title) {
        return -1;
      } else if (a.title > b.title) {
        return 1;
      }
    });
    if (isSearched) {
      handleData(ssData);
    } else {
      handleData(arrayOfData);
    }
    isSorted = false;
  } else if (!isSorted) {
    isAscending = !isAscending;
    arrayOfData.reverse(function (a, b) {
      if (b.title < a.title) {
        return -1;
      } else if (b.title > a.title) {
        return 1;
      }
    });
    ssData.reverse(function (a, b) {
      if (b.title < a.title) {
        return -1;
      } else if (b.title > a.title) {
        return 1;
      }
    });
    if (isSearched) {
      handleData(ssData);
    } else {
      handleData(arrayOfData);
    }
  }
};

// handel reset data
const handleReset = () => {
  arrayOfData.sort(function (a, b) {
    if (b.id > a.id) {
      return -1;
    } else if (b.id < a.id) {
      return 1;
    }
  });
  handleData(arrayOfData);
  if (isSearched) {
    isSearched = !isSearched;
  }
};

// handel click edit button to send data in form
const handleEdit = (e) => {
  isEdit = true;
  id.readOnly = true;
  let i = Number(e.value);
  arrayOfData.forEach(function (aa) {
    if (aa.id === i) {
      console.log(aa);
      id.value = aa.id;
      userId.value = aa.userId;
      title.value = aa.title;
      if (aa.completed === true) {
        comp[0].checked = true;
      } else if (aa.completed === false) {
        comp[1].checked = true;
      }
    }
  });
};

// delete data in array
const handleDelete = (e) => {
  let confirmDelete = confirm("Are yuo sure ?");
  if (confirmDelete) {
    let id = Number(e.value);
    let deletedArray;
    console.log(id);
    arrayOfData.forEach((item, index) => {
      if (item.id == id) {
        arrayOfData.splice(index, 1);
        deletedArray = item;
      }
    });
    ssData.forEach((item, index) => {
      if (item.id == id) {
        ssData.splice(index, 1);
        deletedArray = item;
      }
    });
    // console.log(arrayOfData);
    if (isSearched) {
      handleData(ssData);
    } else {
      handleData(arrayOfData);
    }

    dataDelete(deletedArray);
  }
};

// delete in server
function dataDelete(id) {
  console.log(id);
  fetch(`${basedUrl}/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("DELETE");
      console.log(data);
    });
}

// data submit
form1.addEventListener("submit", (e) => {
  e.preventDefault();
  formValidation(e);
  id.value = "";
  title.value = "";
  userId.value = "";
});

const formValidation = (e) => {
  var userIdError = (titleError = true);
  // console.log("Form Validation")
  let usId = userId.value;
  if (usId === "") {
    printError("userIdError", "Please enter userId");
  } else {
    var regex = /^\d+$/;
    if (regex.test(userId.value) === false) {
      printError("userIdError", "Please valid UserId");
    } else {
      printError("userIdError", "");
      userIdError = false;
    }
  }
  if (title.value === "") {
    printError("titleError", "Please enter title");
  } else {
    printError("titleError", "");
    titleError = false;
  }
  if ((userIdError || titleError) == true) {
    return false;
  } else {
    // console.log(userIdError, titleError);
    acceptData();
  }
};
const printError = (err, msg) => {
  document.getElementById(err).innerHTML = msg;
};

//accept Data and display
const acceptData = async () => {
  // console.log("Clicked ");
  if (isEdit) {
    let i = Number(id.value);

    arrayOfData.forEach(function (aa) {
      if (aa.id === i) {
        console.log(aa.id);
        let aaArr = aa;
        aa.id = Number(id.value);
        aaArr.userId = Number(userId.value);
        aaArr.title = title.value;
        console.log(comp.length);
        if (comp[0].checked) {
          aaArr.completed = true;
        } else if (comp[1].checked) {
          aaArr.completed = false;
        }
        // console.log(aaArr.completed)
        handleData(arrayOfData);
        putData(aaArr);
      }
    });
    ssData.forEach(function (aa) {
      if (aa.id === i) {
        console.log(aa.id);
        let aaArr = aa;
        aa.id = Number(id.value);
        aaArr.userId = Number(userId.value);
        aaArr.title = title.value;
        if (comp[0].checked) {
          aaArr.completed = true;
        } else if (comp[1].checked) {
          aaArr.completed = false;
        }

        handleData(ssData);
        putData(aaArr);
      }
    });
  } else {
    const newData = {};
    newData.userId = Number(userId.value);
    newData.title = title.value;
    if (comp[0].checked) {
      newData.completed = true;
    } else if (comp[1].checked) {
      newData.completed = false;
    }
    console.log(newData);
    const nData = await postData(newData);
    console.log(nData);
    arrayOfData.push(nData);
    handleData(arrayOfData);
    alert("Data Added Successfully and its id is " + nData.id);
  }
};

// post data in server
function postData(newData) {
  // console.log(newData);
  const newDataFetch = fetch(`${basedUrl}`, {
    method: "POST",
    body: JSON.stringify({
      userId: newData.userId,
      title: `${newData.title}`,
      completed: newData.completed,
    }),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("POST");
      console.log(data);
      return data;
    });
  return newDataFetch;
}

//put data in server
function putData(newData) {
  fetch(`${basedUrl}/${newData.id}`, {
    method: "PUT",
    body: JSON.stringify({
      id: newData.id,
      userId: newData.userId,
      title: `${newData.title}`,
      completed: newData.completed,
    }),
    headers: { "content-type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("PUT");
      console.log(data);
    });
}

// handel Search
const handelSearchKey = (e) => {
  // console.log(e.key.trim().length)
  console.log(e.key.trim().length);
  if (e.key.trim().length === 0) {
    document.getElementById("searchBtn").style.visibility = "hidden";
    document.getElementById("searchReset").style.visibility = "hidden";
  } else {
    document.getElementById("searchBtn").style.visibility = "visible";
  }
  let val = e.keyCode;
  if (e.value == " ") {
    sortBtn.style.display = " ";
  } else if (val === 13) {
    handleSearch();
  }
};

var ssData = [];
var isSearched;
const handleSearch = () => {
  isSearched = true;
  ssData = [];
  var search = document.getElementById("searchText");
  var storeVal = search.value
  let curVal = search.value.trimStart().toUpperCase();

  arrayOfData.forEach(function (arr) {
    if (arr.title.toUpperCase().indexOf(curVal) > -1) {
      ssData.push(arr);
    }
  });
  // arrayOfData = ssData;
  handleData(ssData);
  document.getElementById("searchReset").style.visibility = "visible";
  document.getElementById("searchText").value = storeVal
  
};
