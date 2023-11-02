//initialise To-Do list
document.addEventListener("DOMContentLoaded", function () {
  console.log("calling getToDo");
  getToDoList();
});

//event handlers
document.getElementById("addBtn").addEventListener("click", addItem);
document.getElementById("uploadListBtn").addEventListener("click", uploadToDo);
document.getElementById("listEntries").addEventListener("click", showDesc);


//functions

//getting todo list from JSON file
function getToDoList() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let toDoResult = JSON.parse(this.responseText);
      let toDoList = "";
      for (let item of toDoResult.todo) {
        toDoList =
          toDoList +
          "<li title='" +
          String(item.title) +
          "' priority='" +
          String(item.priority) +
          "' description='" +
          String(item.description) +
          "'>" +
          String(item.title) +
          " (" +
          String(item.priority) +
          ")" +
          "   <input type='checkbox' onClick='crossOff(this);'> <button type='button' onClick='this.parentNode.remove()';> Delete </button> </li>";
      }

      document.getElementById("listEntries").innerHTML = toDoList;
    } else {
      console.log("xhttp request problem occurred");
    }
  };
  xhttp.open("GET", "api/todo", true);
  xhttp.send();
}

function crossOff(checkboxElem) {
  let listItem = checkboxElem.parentElement;
  listItem.classList.toggle("crossedOff");
}

//add new item at bottom of list
function addItem() {
  let newItem = document.getElementById("newItem").value;
  let priorityValue = document.getElementById("prioritySelect").value;
  let itemDescValue = document.getElementById("itemDescTxt").value;
  

  let newListItem = document.createElement("li");
  //checkbox functionality
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onclick = function () {
    crossOff(this);
  };
  //delete button functionality
  let deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.onclick = function() {
    this.parentNode.remove();
  };
  deleteButton.innerText = "Delete";
  //adding list item to the bottom of list
  newListItem.innerHTML = newItem + " (" + priorityValue + ") ";
  newListItem.setAttribute("title", newItem);
  newListItem.setAttribute("priority", priorityValue);
  newListItem.setAttribute("description", itemDescValue);
  newListItem.appendChild(checkbox);
  newListItem.appendChild(deleteButton);

  document.getElementById("listEntries").appendChild(newListItem);
  //clear the input boxes
  document.getElementById("newItem").value = "";
  document.getElementById("itemDescTxt").value = "";
}
//show the description of the item
function showDesc(e){
  console.log("item: " + e.target);
  let itemName = e.target.getAttribute("title");
  let itemPriority = e.target.getAttribute("priority");
  let itemDesc = e.target.getAttribute("description");
  document.getElementById("itemEntry").value = itemName;
  document.getElementById("priorityEntry").value = itemPriority;
  document.getElementById("descEntry").value = itemDesc;
}

//upload list to JSON 
function uploadToDo() {
  let uploadList = document.getElementById("listEntries");
  var entriesList = uploadList.getElementsByTagName("li");
  console.log("entries no. " + entriesList.length);
  //object to convert to JSON
  let uploadObject = {};
  uploadObject.todo = [];

  for (let i = 0; i < entriesList.length; i++) {
    console.log("upload entry " + entriesList[i].innerHTML);
    let objEntry = {};

    objEntry.title = entriesList[i].getAttribute("title") || "";
    objEntry.priority = entriesList[i].getAttribute("priority") || "";
    objEntry.description = entriesList[i].getAttribute("description") || "";

    uploadObject.todo.push(objEntry);
  }
  console.log("upload Object:" + JSON.stringify(uploadObject));
  console.log(uploadObject.todo[3]);
  //convert object to JSON and put to api
  let xhttp = new XMLHttpRequest();
  let url = "/api/todo";
  xhttp.onreadystatechange = function () {
    let strResponse = "Error: no response";
    if (this.readyState == 4 && this.status == 200) {
      strResponse = JSON.parse(this.responseText);
      alert(strResponse.message);
    }
  };
  xhttp.open("PUT", url, true);
  var data = JSON.stringify(uploadObject);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(data);
}







    


  
