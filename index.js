const AddTasks = document.querySelector(".add-task");
const AddBtn = document.querySelector(".add-btn");
const clearAllBtn = document.querySelector(".clear");
const makeChangeBtn = document.querySelector(".make-changes");
const allTasks = document.querySelector(".tasks");
const exitBtn = document.querySelector(".exit-btn")
let TodoContract;
let taskArray = [];
let idx;
const TodoContactAddress = "0xed22DDcd8f2335BCa65850592a9A67b0a7702acc";
const todoABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "task",
				"type": "string"
			}
		],
		"name": "addTodo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "clearAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "deleteTodo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "updateValue",
				"type": "string"
			}
		],
		"name": "editTodo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "updateTodo",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			}
		],
		"name": "getTodoAtIndex",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "task",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "completed",
						"type": "bool"
					}
				],
				"internalType": "struct Todo.TodoItem",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTodos",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "task",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "completed",
						"type": "bool"
					}
				],
				"internalType": "struct Todo.TodoItem[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "todoList",
		"outputs": [
			{
				"internalType": "string",
				"name": "task",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "completed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
//   sepolia chain ID
const chainId = 11155111;
const provider = new ethers.providers.Web3Provider(window.ethereum, chainId);

async function connectToMetamask() {
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  TodoContract = new ethers.Contract(TodoContactAddress, todoABI, signer);
  console.log(TodoContract, "TodoContract");

    await getTasks();
}

connectToMetamask();

// function to add a task.
async function addTask() {
  AddBtn.disabled = true;
  try {
    const taskText = AddTasks.value;
    if (taskText.trim().length !== 0) {
      const tx = await TodoContract.addTodo(taskText);
      await tx.wait(); // Wait for the transaction to be mined
      await getTasks(); // Fetch tasks
      alert("Task added successfully.");
      AddTasks.value = "";
      AddBtn.disabled = false;
    } else {
      AddBtn.disabled = false;
      alert("Task text is empty.");
    }
  } catch (error) {
    alert("Error adding task");
    console.log(error);
  }finally {
    AddTasks.value = "";
    AddBtn.disabled = false;
  }
}

// mark a task as completed
async function completed(index, task, tickComplete) {
// where;
//index uniquely identifies the task we want to mark as completed
// task is the task words that we want to add some styling to show users it has been completed
  //tickComplete is the button that users would tick if they have completed a task
try {
    if (!task.completed) {
      const tx = await TodoContract.updateTodo(index);
      await tx.wait();
      alert(`Well Done! you have completed this task; ${task.task}`);
      tickComplete.disabled = false;
//Getting the edit button and disabling it 
      const item = document.querySelector(`.list${index}`);
      const editButton = item.querySelector(".edit");
      editButton.disabled = true;

      const checkmark = item.querySelector(".tickComplete");
      checkmark.classList.add("tick");
      const spanElement = checkmark.querySelector("span");
      spanElement.innerHTML = "&#x2713;";
      item.querySelector(".text").classList.add("completed");
    } else {
      alert("Task already completed");
    }
  } catch (error) {
    console.log(error, "err");
    tickComplete.disabled = false;
    alert("Error updating completed status");
  }
}


// create an element when task has successfully been added to all to-dos
function createElements(task, index, fragment) {
  const list = document.createElement("li");
  list.className = "active";
  //   make each list item unique by adding a className relative to its index
  list.classList.add(`list${index}`);
  const content = document.createElement("div");
  content.className = "content";
// creating a box where users can tick for completed task
  const tickComplete = document.createElement("button");
  tickComplete.className = "tickComplete";
// creating the tick that would be activated when clicking the box above
  const checkmark = document.createElement("span");
  tickComplete.appendChild(checkmark);
  //   controlling the event on the tick box, to mark as completed
  tickComplete.addEventListener("click", () => {
    tickComplete.disabled = true;
    completed(index, task, tickComplete);
  });

  const taskText = document.createTextNode(task.task);
  const textTag = document.createElement("p");
  textTag.className = "text";
  textTag.appendChild(taskText);
  content.appendChild(tickComplete);
  content.appendChild(textTag);
  const edit = document.createElement("div");
  edit.className = "close";
  const editButton = document.createElement("button");
  editButton.className = "edit";
  editButton.textContent = "Edit";
  editButton.addEventListener("click", () => {
    editButton.disabled = true;
    idx = index;
    openModal(index);
    editButton.disabled = false;
  });
  edit.appendChild(editButton);
  if (task.completed) {
    editButton.disabled = true;
    tickComplete.classList.add("tick");
    checkmark.innerHTML = "&#x2713;";
    textTag.classList.add("completed");
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "X";
  deleteBtn.className = "delete";
  deleteBtn.addEventListener("click", () => {
    deleteBtn.disabled = true;
    deleteTodo(index);
  });

  edit.appendChild(deleteBtn);

  list.appendChild(content);
  list.appendChild(edit);

  fragment.appendChild(list);
}

// function to get all todo tasks
async function getTasks() {
  try {
    const todos = await TodoContract.getTodos();
    taskArray = todos;
    const fragment = document.createDocumentFragment();

    taskArray.forEach((task, index) => {
      createElements(task, index, fragment);
    });
    allTasks.innerHTML = "";

    // Append all new elements in the fragment to the existing list
    allTasks.appendChild(fragment);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// function to clear all todo items
async function clearAll() {
  try {
    if (taskArray.length !== 0) {
      clearAllBtn.disabled = true;
      const tx = await TodoContract.clearAll();
      tx.wait();
      clearAllBtn.disabled = false;
      allTasks.innerHTML = "";
      alert("All tasks cleared successfully.");
    } else {
      alert("No task to clear");
    }
  } catch (error) {
    console.error("Error clearing tasks:", error);
    clearAllBtn.disabled = false;
    // Display an error message to the user
    alert("Error clearing tasks. Please try again later.");
  }
}

// delete a specific todo
async function deleteTodo(index) {
  try {
    const tx = await TodoContract.deleteTodo(index);
    await tx.wait();

    // Select the element to delete based on the index class name
    const deletedItem = document.querySelector(`.list${index}`);
    deletedItem.querySelector(".delete").disabled = true;
    if (deletedItem) {
      deletedItem.remove();
      alert("Item deleted successfully");
      deletedItem.querySelector(".delete").disabled = false;
    } else {
      console.log("Element not found");
    }
  } catch (error) {
    deletedItem.querySelector(".delete").disabled = false;
    console.error("Error deleting todo:", error);
  }
}

// open the modal to edit todo
async function openModal(index) {
  const modal = document.getElementById("myModal");
  modal.style.display = "flex";
  const editText = document.querySelector(".edit-area");
  const value = await TodoContract.getTodoAtIndex(index);
  editText.value = await value.task;
}

// Function to close the modal
function closeModal() {
  const modal = document.getElementById("myModal");
  modal.style.display = "none";
}

// edit a todo
async function makeChanges(index) {
  try {
    const makeChanges = document.querySelector(".edit-area");
    const value = makeChanges.value;
    if (value.trim().length !== 0 && value !== (await taskArray[index].task)) {
      const tx = await TodoContract.editTodo(index, value);
      await tx.wait();
      alert("task updated successfully");
      const listItemChanged = document.querySelector(`.list${index}`);
      const content = listItemChanged.querySelector(".content");
      const newValue = await TodoContract.getTodoAtIndex(index);
      // Get the taskText text node directly from the content element
      const taskTextNodeToUpdate = content.childNodes[1];
      taskTextNodeToUpdate.textContent = await newValue.task;
    } else {
      alert("No value to make changes");
      closeModal();
    }
  } catch (error) {
    alert("Error updating task");
    console.log(error);
  }
}


// event listeners
AddBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAll);
makeChangeBtn.addEventListener("click", () => {
  makeChanges(idx);
  closeModal();
});
exitBtn.addEventListener("click", closeModal);