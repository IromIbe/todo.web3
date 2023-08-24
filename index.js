const AddTasks = document.querySelector(".add-task");
const AddBtn = document.querySelector(".add-btn");
const clearAllBtn = document.querySelector(".clear");
let TodoContract;
const TodoContactAddress = "0xd9145CCE52D386f254917e481eB44e9943F39138";
const todoABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "task",
        type: "string",
      },
    ],
    name: "addTodo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "clearAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "deleteTodo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "updateValue",
        type: "string",
      },
    ],
    name: "editTodo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "updateTodo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getTodos",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "task",
            type: "string",
          },
          {
            internalType: "bool",
            name: "completed",
            type: "bool",
          },
        ],
        internalType: "struct Todo.TodoItem[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "todoList",
    outputs: [
      {
        internalType: "string",
        name: "task",
        type: "string",
      },
      {
        internalType: "bool",
        name: "completed",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
//   sepolia chain ID
const chainId = 11155111;
const provider = new ethers.providers.Web3Provider(window.ethereum, chainId);

async function connectToMetamask() {
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  TodoContract = new ethers.Contract(TodoContactAddress, todoABI, signer);
  console.log(TodoContract, "TodoContract");

  //   await getTasks();
}

connectToMetamask();

// function to add a task.
async function addTask() {
  await connectToMetamask();
  try {
    const taskText = AddTasks.value;
    if (taskText) {
      await TodoContract.addTodo(taskText);
      console.log("Task added successfully.");
    } else {
      console.log("Task text is empty.");
    }
  } catch (error) {
    console.log(error);
  }
}

// function to get all todo tasks

async function getTasks() {
  await connectToMetamask();
  try {
    const todos = await TodoContract.getTodos();
    console.log("Todos:", todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// function to clear all todo items

async function clearAll() {
  try {
    await connectToMetamask();
    await TodoContract.clearAll();
    console.log("All tasks cleared successfully.");
  } catch (error) {
    console.error("Error clearing tasks:", error);
    // Display an error message to the user
    alert("Error clearing tasks. Please try again later.");
  }
}

// event listeners
AddBtn.addEventListener("click", addTask);
clearAllBtn.addEventListener("click", clearAll);
getTasks();
