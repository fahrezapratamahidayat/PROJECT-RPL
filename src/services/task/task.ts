import { firestore } from "@/lib/firebase/init";
import { addDoc, arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, query, setDoc, updateDoc, where } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';
import { getDataByField } from "../auth/services";
import { Module, TasksData } from "@/types";

export async function randomId() {
    return uuidv4();
}

export async function getTasksByUserId(userId: string) {
  const getTasksUser = await getDataByField("tasks", "createdBy", userId);
  const tasks = [
    ...getTasksUser
  ]
  return {
    status: true,
    message: "berhasil",
    tasks: tasks
  }
}

export async function addTasks(taskData: TasksData){
    if (!taskData.modules) {
    taskData.modules = [];
    }
    if (!taskData.teams) {
        taskData.teams = [];
    }
    if (taskData.status === undefined) {
        taskData.status = false;
    }
    if (!taskData.statusTask) {
        taskData.statusTask = "on going";
    }
    taskData.created_At = new Date();
    try {
      await addDoc(collection(firestore, "tasks"), taskData);
      return {
          status: true,
          statusCode: 200,
          message: "User created successfully"
      }
  } catch (error) {
      return {
          status: false,
          statusCode: 400,
          message: "Something went wrong please try again later"
      }
  }
}

export async function deleteTaskById(id: string) {
  try {
    const docRef = doc(firestore, "tasks", id);
    await deleteDoc(docRef);
    return {
      status: true,
      statusCode: 200,
      message: "Task deleted successfully",
    };
  }catch{
    return {
      status: false,
      statusCode: 403,
      message: "something went wrong",
    }
  }
}

export async function updateTaskById(taskData: TasksData) {
  try {
    const docRef = doc(firestore, "tasks", taskData.id);
    await updateDoc(docRef, taskData);
    return {
      status: true,
      statusCode: 200,
      message: "Task updated successfully",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Failed to update task, please try again later"
    };
  }
}

export async function updateTaskWithModules(taskData: Module) {
  try {
    if (!taskData.subid) {
      taskData.subid = await randomId();
    }
    if(!taskData.isCompleted) {
      taskData.isCompleted = false;
    }
    if (!taskData.dueDate) {
      taskData.dueDate = 'not set';
    }
    if (!taskData.dueTime) {
      taskData.dueTime = 'not set';
    }
    const docRef = doc(firestore, "tasks", taskData.id);
    await updateDoc(docRef, {
      modules: arrayUnion(taskData),
    });
    return {
      status: true,
      statusCode: 200,
      message: "Task with modules updated successfully",
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Failed to update task with modules, please try again later"
    };
  }
}

export async function updateSubtask(subtaskData: Module) {
  try {
    const docRef = doc(firestore, "tasks", subtaskData.id);
    const taskSnapshot = await getDoc(docRef);

    if (!taskSnapshot.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "Task tidak ditemukan"
      };
    }

    const task = taskSnapshot.data();
    const modules = task.modules || [];
    const existingSubtask = modules.find((m: Module)=> m.subid === subtaskData.subid);
    if (!existingSubtask) {
      return {
        status: false,
        statusCode: 404,
        message: "Subtask tidak ditemukan"
      };
    }

    await updateDoc(docRef, {
      modules: arrayRemove(existingSubtask)
    });

    const updatedSubtask = { ...existingSubtask, ...subtaskData };
    await updateDoc(docRef, {
      modules: arrayUnion(updatedSubtask)
    });

    return {
      status: true,
      statusCode: 200,
      message: "Subtask berhasil diperbarui"
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Gagal memperbarui subtask, silakan coba lagi nanti"
    };
  }
}

export async function deleteSubTask(subtaskData: Module) {
  try {
    const docRef = doc(firestore, "tasks", subtaskData.id);
    const taskSnapshot = await getDoc(docRef);

    if (!taskSnapshot.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "Task tidak ditemukan"
      };
    }

    const task = taskSnapshot.data();
    const modules = task.modules || [];
    const existingSubtask = modules.find((m: Module) => m.subid === subtaskData.subid);

    if (!existingSubtask) {
      return {
        status: false,
        statusCode: 404,
        message: "Subtask tidak ditemukan"
      };
    }

    await updateDoc(docRef, {
      modules: arrayRemove(existingSubtask)
    });

    return {
      status: true,
      statusCode: 200,
      message: "Subtask berhasil dihapus"
    };
  } catch (error) {
    return {
      status: false,
      statusCode: 400,
      message: "Gagal menghapus subtask, silakan coba lagi nanti"
    };
  }
}


export async function AddTaskTeams(taskData: TasksData) {
  if (!taskData.modules) {
    taskData.modules = [];
    }
    if (!taskData.teams) {
        taskData.teams = [];
    }
    if (taskData.status === undefined) {
        taskData.status = false;
    }
    if (!taskData.statusTask) {
        taskData.statusTask = "on going";
    }
    taskData.created_At = new Date();
    try {
      await addDoc(collection(firestore, "tasks"), taskData);
      return {
          status: true,
          statusCode: 200,
          message: "User created successfully"
      }
  } catch (error) {
      return {
          status: false,
          statusCode: 400,
          message: "Something went wrong please try again later"
      }
  }
}

export async function getTaskTeams(email: string) {
  const q = query(collection(firestore, "tasks"), where("assigned", "array-contains", email));
  const querySnapshot = await getDocs(q);
  const getData : TasksData[] = querySnapshot.docs.map((doc) => ({
    ...doc.data() as TasksData,
    id: doc.id,
  }));
  return getData
}

// export async function addTaskUser(taskData: {
//   userId: string;
//   taskId: string;
//   owner: string;
//   title: string;
//   description: string;
//   status_task: string;
//   status: boolean;
//   deadline: Date;
//   creadted_At: Date;
//   created_At: Date;
//   modules: Array<{ id: string; name: string }>;
//   teams: Array<{ id: string; name: string, profileUrl: string }>;
//   typeTask: string;
// }) {
//     try {
//         const usersRef = doc(firestore, "users", taskData.userId);
//         const snapshotUsers = await getDoc(usersRef);

//         if (!snapshotUsers.exists()) {
//             return {
//                 status: false,
//                 statusCode: 404,
//                 message: "User Tidak Ditemukan"
//             }
//         }

//         const user = snapshotUsers.data();
//         const taskId = await randomId();

//         const userTasks = user.tasks || [];
//         userTasks.push(taskData);
//         if (!taskData.modules) {
//             taskData.modules = [];
//         }
//         if (!taskData.teams) {
//             taskData.teams = [];
//         }
//         if (taskData.status === undefined) {
//             taskData.status = false;
//         }
//         if (!taskData.status_task) {
//             taskData.status_task = "In Progress";
//         }
//         if(!taskData.taskId) {
//             taskData.taskId = taskId;
//         }
//         await setDoc(usersRef, { tasks: userTasks }, { merge: true });

//         return {
//             status: true,
//             statusCode: 200,
//             message: "Task added successfully",
//             taskId: taskId
//         };
//     } catch (error) {
//         return {
//             status: false,
//             statusCode: 500,
//             message: "Internal Server Error"
//         };
//     }
// }

function deleteTaskFromArray(taskId: string, userData: any) {
  const updatedTasks = userData.tasks.filter((task: any) => task.taskId !== taskId);
  return {
    ...userData,
    tasks: updatedTasks,
  };
}

// export async function deleteTask(data: {
//   userId: string;
//   taskId: string;
//  }) {
//     const userRef = doc(firestore, "users", data.userId);
//     const snapshotUser = await getDoc(userRef);
  
//     if (!snapshotUser.exists()) {
//       return {
//         status: false,
//         statusCode: 404,
//         message: "User Tidak Ditemukan",
//       };
//     }
  
//     const userData = snapshotUser.data();
//     const isTaskInField = userData.tasks.some((task: {taskId:string}) => task.taskId === data.taskId);
//     if (!isTaskInField){
//       return {
//         status: false,
//         statusCode: 404,
//         message: "Task Tidak Ditemukan",
//       }
//     }
//     const updatedUserData = deleteTaskFromArray(data.taskId, userData);
//     await updateDoc(userRef, {
//       tasks: updatedUserData.tasks,
//     });
  
//     return {
//       status: true,
//       statusCode: 200,
//       message: "Task deleted successfully",
//     };
// }

// export async function updateTask(data: {
//     userId: string;
//     taskId: string;
//     task: any;
//   }) {
//     const userRef = doc(firestore, "users", data.userId);
//     const snapshotUser = await getDoc(userRef);
  
//     if (!snapshotUser.exists()) {
//       return {
//         status: false,
//         statusCode: 404,
//         message: "User Tidak Ditemukan",
//       };
//     }
  
//     const userData = snapshotUser.data();
//     const updatedTasks = userData.tasks.map((currentTask: any) => {
//       if (currentTask.taskId === data.taskId) {
//         return { ...currentTask, ...data.task };
//       }
//       return currentTask;
//     });

//     await updateDoc(userRef, {
//       tasks: updatedTasks,
//     });
  
//     return {
//       status: true,
//       statusCode: 200,
//       message: "Task updated successfully",
//     };
// }

export async function filterTasksByType(userId: string, typeTask: string) {
  const userRef = doc(firestore, "users", userId);
  const snapshotUser = await getDoc(userRef);

  if (!snapshotUser.exists()) {
      return {
          status: false,
          statusCode: 404,
          message: "User Tidak Ditemukan",
      };
  }

  const userData = snapshotUser.data();
  const filteredTasks = userData.tasks.filter((task: any) => task.typeTask === typeTask);

  return {
      status: true,
      statusCode: 200,
      message: "Tasks filtered successfully",
      tasks: filteredTasks,
  };
}

  // export async function updateTask(data: {
  //   userId: string;
  //   taskId: string;
  //   task: any;
  // }) {
  //   const userRef = doc(firestore, "users", data.userId);
  //   const snapshotUser = await getDoc(userRef);
  
  //   if (!snapshotUser.exists()) {
  //     return {
  //       status: false,
  //       statusCode: 404,
  //       message: "User Tidak Ditemukan",
  //     };
  //   }
  
  //   const userData = snapshotUser.data();
  //   const updatedTasks = userData.tasks.map((currentTask: any)  => {
  //     const isTaskInArray = currentTask.taskId === data.taskId;
  //     console.log(currentTask.taskId,)
  //     console.log(isTaskInArray)
  //     if (currentTask.taskId === data.taskId) {
  //       return {...currentTask, ...data.task };
  //     }
  //     return currentTask;
  //   });
  
  //   await updateDoc(userRef, {
  //     tasks: updatedTasks,
  //   });
  
  //   return {
  //     status: true,
  //     statusCode: 200,
  //     message: "Task updated successfully",
  //   };
  // }

// export async function deleteTasks(id: string, taskId: string) {
//     try {
//         const userRef = doc(firestore, "users", id);
//         const snapshotUser = await getDoc(userRef);
//         if (!snapshotUser.exists()) {
//             return {
//                 status: false,
//                 statusCode: 404,
//                 message: "User Tidak Ditemukan"
//             }
//         }
        
//         const user = snapshotUser.data();
//         const isTaskInArray = user.tasks.some((task: any) => task.id === taskId);
//         if(!isTaskInArray) {
//             return {
//                 status: false,
//                 statusCode: 404,
//                 message: "Task Tidak Ditemukan"
//             }
//         }
//         console.log(user)
//         await updateDoc(userRef, {
//             tasks: arrayRemove({
//                 id: taskId,
//             })
//         })

//         return {
//             status: true,
//             statusCode: 200,
//             message: "Task deleted successfully"
//         }

//     } catch (error) {

//     }
// }

// Function to add task to user
// export async function addTaskUser(taskData:any, id:any) {
//     try {
//         const usersRef = doc(firestore, "users", id);
//         const userSnapshot = await getDoc(usersRef);

//         if (!userSnapshot.exists()) {
//             return {
//                 status: false,
//                 statusCode: 404,
//                 message: "User not found"
//             };
//         }

//         const user = userSnapshot.data();

//         // Generate unique task ID
//         const taskId = await randomId(); // Wait for the result of randomId()

//         // Create task object
//         const task = {
//             id: taskId,
//             owner: taskData.owner,
//             title: taskData.title,
//             description: taskData.description,
//             status_task: taskData.status_task || "In Progress",
//             status: taskData.status || false,
//             deadline: taskData.deadline,
//             created_At: taskData.created_At,
//             modules: taskData.modules || [],
//             teams: taskData.teams || []
//         };

//         // Add task to user's tasks
//         const userTasks = user.tasks || []; // Get existing user tasks or initialize as empty array
//         userTasks.push(task); // Add new task
//         await setDoc(usersRef, { tasks: userTasks }, { merge: true }); // Merge with existing data

//         return {
//             status: true,
//             statusCode: 200,
//             message: "Task added successfully",
//             taskId: taskId // Return the taskId for reference
//         };
//     } catch (error) {
//         console.error("Error adding task to user:", error);
//         return {
//             status: false,
//             statusCode: 500,
//             message: "Internal Server Error"
//         };
//     }
// }
