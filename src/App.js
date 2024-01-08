import React, { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem("list");
  if (list) {
    return (list = JSON.parse(localStorage.getItem("list")));
  } else {
    return [];
  }
};
function App() {
  const [name, setName] = useState("");
  const [list, setList] = useState(getLocalStorage());

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    msg: "",
    type: "",
  });
  console.log(list);
  const handleSumbit = (e) => {
    e.preventDefault();
    if (!name) {
      displayAlert(true, "please enter the value", "danger");
      console.log("empty");
    } else if (name && isEditing) {
      //edit the list
      setList(
        list.map((item) => {
          if (item.id === editId) {
            return { ...item, title: name };
          }
          return item;
        })
      );
      console.log("item", list);
      setName("");
      setEditID(null);
      displayAlert(true, "success", "value changed");
    } else {
      // display the alert to (item added)
      displayAlert(true, "Item added into the list", "success");
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName("");
    }
  };
  const displayAlert = (show = false, msg = "", type = "") => {
    setAlert({ show, msg, type });
  };

  const deleteItemID = (id) => {
    const removeID = list.filter((item) => item.id !== id);
    displayAlert(true, "Item Removed", "success");
    setList(removeID);
  };
  //clean all
  const cleanAll = () => {
    displayAlert(true, "Item cleaned", "success");
    setList([]);
  };

  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
  };

  //to store the data in local storage given in devTool
  useEffect(() => {
    localStorage.setItem("list", JSON.stringify(list));
  }, [list]);
  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSumbit}>
        {alert.show && (
          <Alert {...alert} removeAlert={displayAlert} list={list} />
        )}
        <h3>To-Do List</h3>
        <div className="form-control">
          <input
            type="text"
            className="grocery"
            placeholder="eg.. Homework"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="submit-btn">
            {isEditing ? "Edit" : "Submit"}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} deleteItemID={deleteItemID} editItem={editItem} />
          <button className="clear-btn" onClick={cleanAll}>
            Clear Items
          </button>
        </div>
      )}
    </section>
  );
}

export default App;
