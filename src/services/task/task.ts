import app from "@/lib/firebase/init";
import { arrayRemove, arrayUnion, doc, getDoc, getFirestore, setDoc, updateDoc } from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

const firestore = getFirestore(app);


export async function randomId() {
    return uuidv4();
}

export async function addTaskUser(taskData: {
    userId: string;
    id: string;
    owner: string;
    title: string;
    description: string;
    status_task: string;
    status: boolean;
    deadline: Date;
    creadted_At: Date;
    created_At: Date;
    modules: Array<{ id: string; name: string }>;
    teams: Array<{ id: string; name: string, profileUrl: string }>
}) {
    try {
        const usersRef = doc(firestore, "users", taskData.userId);
        const snapshotUsers = await getDoc(usersRef);

        if (!snapshotUsers.exists()) {
            return {
                status: false,
                statusCode: 404,
                message: "User Tidak Ditemukan"
            }
        }

        const user = snapshotUsers.data();
        const taskId = await randomId();

        const userTasks = user.tasks || [];
        userTasks.push(taskData);
        if (!taskData.modules) {
            taskData.modules = [];
        }
        if (!taskData.teams) {
            taskData.teams = [];
        }
        if (taskData.status === undefined) {
            taskData.status = false;
        }
        if (!taskData.status_task) {
            taskData.status_task = "In Progress";
        }
        if(!taskData.id) {
            taskData.id = taskId;
        }
        await setDoc(usersRef, { tasks: userTasks }, { merge: true });

        return {
            status: true,
            statusCode: 200,
            message: "Task added successfully",
            taskId: taskId
        };
    } catch (error) {
        return {
            status: false,
            statusCode: 500,
            message: "Internal Server Error"
        };
    }
}

function deleteTaskFromArray(taskId: string, userData: any) {
  const updatedTasks = userData.tasks.filter((task: any) => task.id !== taskId);
  return {
    ...userData,
    tasks: updatedTasks,
  };
}

 export async function deleteTask(data: {
  userId: string;
  taskId: string;
 }) {
    const userRef = doc(firestore, "users", data.userId);
    const snapshotUser = await getDoc(userRef);
  
    if (!snapshotUser.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "User Tidak Ditemukan",
      };
    }
  
    const userData = snapshotUser.data();
    const isTaskInField = userData.tasks.some((task: any) => task.id === data.taskId);
    if (!isTaskInField){
      return {
        status: false,
        statusCode: 404,
        message: "Task Tidak Ditemukan",
      }
    }
    const updatedUserData = deleteTaskFromArray(data.taskId, userData);
    await updateDoc(userRef, {
      tasks: updatedUserData.tasks,
    });
  
    return {
      status: true,
      statusCode: 200,
      message: "Task deleted successfully",
    };
  }

  export async function updateTask(id: string, taskId: string, task: any) {
    const userRef = doc(firestore, "users", id);
    const snapshotUser = await getDoc(userRef);
  
    if (!snapshotUser.exists()) {
      return {
        status: false,
        statusCode: 404,
        message: "User Tidak Ditemukan",
      };
    }
  
    const userData = snapshotUser.data();
    const updatedTasks = userData.tasks.map((currentTask: any) => {
      if (currentTask.id === taskId) {
        return { ...currentTask, ...task };
      }
      return currentTask;
    });
  
    await updateDoc(userRef, {
      tasks: updatedTasks,
    });
  
    return {
      status: true,
      statusCode: 200,
      message: "Task updated successfully",
    };
  }
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
