import mainBackground from "../src/assets/images/MainBg.png"
import tvImage from "../src/assets/images/TV.png"
import timer from "../src/assets/images/Timer.png"
import manTableImage from "../src/assets/images/ManTable.png"
import womanTableImage from "../src/assets/images/WomanTable.png"
import MaleFire from "../src/assets/images/MaleFire.png"
import FemaleFire from "../src/assets/images/FemaleFire.png"
import { useEffect, useState } from "react"
import ListItem from "./components/ListItem"
import { useDrop } from "react-dnd"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import Timer from "./components/Timer"

const App = () => {

    // states
    const [tvTasks, setTvTasks] = useState([]);
    const [manTasks, setManTasks] = useState([]);
    const [womanTasks, setWomanTasks] = useState([]);

    // fetching data
    const { data: tasks = [], refetch } = useQuery({
        queryKey: ["tasks"],
        queryFn: async () => {
            const res = await axios.get("https://dnd-game-server.vercel.app/tasks")
            return res.data;
        }
    })

    // useEffect to update task status on window load
    useEffect(() => {
        // Define a function to update task status
        const updateTaskStatusOnUnload = () => {

            // assigned tasks
            const assignedToEmployee = tasks?.filter((data) => data.status !== "assignedToNone");

            // Updating task status to assignedToNon
            for (const task of assignedToEmployee) {
                axios.put(`https://dnd-game-server.vercel.app/tasks/${task._id}`, { status: "assignedToNone" });
            }
        };

        // Attach the function to the "beforeunload" event
        window.addEventListener("beforeunload", updateTaskStatusOnUnload);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("beforeunload", updateTaskStatusOnUnload);
        };
    }, [tasks]);


    // dnd droppers for manTasks
    const [{ isOver: isOverManTasks }, dropManTasks] = useDrop(() => ({
        accept: "singleTask",
        drop: (item) => addItemToList(item.id, "assignedToMan"),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // dnd droppers for womanTasks
    const [{ isOver: isOverWomanTasks }, dropWomanTasks] = useDrop(() => ({
        accept: "singleTask",
        drop: (item) => addItemToList(item.id, "assignedToWoman"),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));


    // useEffect for steps
    useEffect(() => {
        const unassignedData = tasks?.filter(data => data.status === "assignedToNone")
        const manTableData = tasks?.filter(data => data.status === "assignedToMan");
        const womanTableData = tasks?.filter(data => data.status === "assignedToWoman");
        setTvTasks(unassignedData)
        setManTasks(manTableData);
        setWomanTasks(womanTableData);
    }, [tasks])

    // adding tasks to updated list
    const addItemToList = async (id, status) => {
        await axios.put(`https://dnd-game-server.vercel.app/tasks/${id}`, { status })
            .then(res => {
                const data = res.data;
                if (data.modifiedCount > 0) {
                    console.log("task status updated", status);
                }
            })
        refetch();
    }

    console.log("dropping? : ", isOverManTasks, isOverWomanTasks);



    return (
        <div className="min-h-screen container mx-auto bg-no-repeat sm:bg-cover" style={{ backgroundImage: `url(${mainBackground})` }}>
            <div className="relative flex justify-between">
                {/* tv-area */}
                <div className="fixed sm:left-52 sm:top-4">
                    <img className="w-1/2 lg:w-1/3" src={tvImage} alt="tv_image" />
                    <ul className="flex flex-col gap-2 pl-2 lg:pl-9 -mt-[120px] lg:-mt-36">
                        {
                            tvTasks?.map(item => <ListItem
                                key={item._id}
                                data={item}>
                            </ListItem>)
                        }

                    </ul>
                </div>

                {/* timer-area */}
                <div className="fixed -right-72 lg:right-0 top-0 lg:top-4">
                    <img className="w-1/3 lg:w-1/2" src={timer} alt="timer_image" />
                    <div className="pl-8 lg:pl-12 -mt-14 lg:-mt-24">
                        <p className="text-red-500 text-sm lg:text-base lg:pl-5">Game Timer</p>
                        <p className="text-white pl-3 lg:pl-0 text-xl lg:text-5xl font-bold"><Timer></Timer></p>
                    </div>
                </div>
            </div>
            <div>
                {/* man-table */}
                <div>
                    <img className="fixed bottom-0 sm:left-72 w-[200px] lg:w-[350px]" src={manTableImage} alt="man_table_image" />
                    <ul ref={dropManTasks} className="fixed h-[125px] w-[150px] lg:w-[225px] border p-2 bottom-[200px] lg:bottom-[350px] sm:left-96 flex flex-col gap-2">
                        {
                            manTasks?.map(item => <ListItem
                                key={item._id}
                                data={item}>
                            </ListItem>)
                        }
                    </ul>
                    {/* male-fire */}
                    <img className={`${manTasks.length <= 2 ? "hidden" : "flex"} fixed -bottom-10 left-[54px] lg:left-96 w-[108px] lg:w-[180px]`} src={MaleFire} alt="male-fire" />
                </div>

                {/* woman-table */}
                <div>
                    <img className="fixed bottom-0 right-0 lg:right-72 w-[200px] lg:w-[350px]" src={womanTableImage} alt="woman_table_image" />
                    <ul ref={dropWomanTasks} className="fixed h-[125px] w-[150px] lg:w-[225px] border p-2 bottom-[200px] lg:bottom-[350px] right-0 sm:right-96 flex flex-col gap-2">
                        {
                            womanTasks?.map(item => <ListItem
                                key={item._id}
                                data={item}>
                            </ListItem>)
                        }
                    </ul>
                    {/* female-fire */}
                    <img className={`${womanTasks.length <= 1 ? "hidden" : "flex"} fixed -bottom-10 right-[38px] lg:right-[365px] w-[108px] lg:w-[175px]`} src={FemaleFire} alt="female-fire" />
                </div>
            </div>
        </div>
    );
};

export default App;