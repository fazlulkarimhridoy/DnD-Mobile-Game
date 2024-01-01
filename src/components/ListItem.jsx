/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useDrag } from "react-dnd";

const ListItem = ({ data }) => {
    // states and hooks
    const { _id, title, status } = data;

    // dnd dragger
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "singleTask",
        item: { id : _id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }))

    // console.log("dragging? : ", isDragging);

    return (
        <li ref={drag} className={`bg-sky-500 p-1 text-white ${status === "assignedToMan" || status === "assignedToWoman" ? "w-full" : "w-[175px] lg:w-1/4"} text-center rounded-sm hover:scale-105 transition-all ease-out duration-300`}>
            {title}
        </li>
    );
};

export default ListItem;