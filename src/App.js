import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState(null);
  function handleShowAddForm() {
    setShowAddForm((cur) => !cur);
  }
  function handleShowBillForm(obj) {
    setSelectFriend((cur) => (cur?.id === obj?.id ? null : obj));
    setShowAddForm(false);
  }
  function handleSplitBill(balance) {
    setFriendsList((f) =>
      f.map((item) =>
        item.id === selectFriend.id
          ? { ...item, balance: item.balance + balance }
          : item
      )
    );
    setSelectFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendsList={friendsList}
          onShowBillForm={handleShowBillForm}
          selectFriend={selectFriend}
        />
        {showAddForm && <FormAddFriend updateFriendList={setFriendsList} />}
        <Button onClick={handleShowAddForm}>
          {showAddForm ? "Close Add Form" : "Add Friend"}
        </Button>
      </div>
      {selectFriend && (
        <FormSplitBill
          onSplitBill={handleSplitBill}
          selectFriend={selectFriend}
          key={selectFriend.id}
        />
      )}
    </div>
  );
}

function FriendsList({ friendsList, onShowBillForm, selectFriend }) {
  return (
    <ul>
      {friendsList.map((f) => (
        <Friend
          key={f.id}
          obj={f}
          onShowBillForm={onShowBillForm}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ obj, onShowBillForm, selectFriend }) {
  const selected = obj?.id === selectFriend?.id;
  console.log(selected);
  return (
    <li className={selected ? "select" : ""}>
      <img src={obj.image} alt={obj.name} />
      <h3>{obj.name}</h3>
      {obj.balance < 0 && (
        <p className="red">
          Ты заскамил {obj.name} как мамонта на сумму {Math.abs(obj.balance)} р.
          ,не надо так.
        </p>
      )}
      {obj.balance > 0 && (
        <p className="green">
          Протри бивни, {obj.name} заскамил тебя на {Math.abs(obj.balance)} Р.
        </p>
      )}
      {obj.balance === 0 && (
        <p>Вы и {obj.name} не мамонты, но всё может измениться будь на чеку.</p>
      )}
      <Button className="button" onClick={() => onShowBillForm(obj)}>
        {selected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ updateFriendList }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48?u=");
  function handleAddFriend(e) {
    e.preventDefault();
    const createFriend = {
      id: new Date(),
      name: name,
      image: image,
      balance: 0,
    };
    updateFriendList((list) => [...list, createFriend]);
    setImage("https://i.pravatar.cc/48?u=");
    setName("");
  }
  return (
    <form className="form-add-friend" onSubmit={(e) => handleAddFriend(e)}>
      <label> Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>ImageUrl</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [yourPay, setYourPay] = useState("");
  const [whoPay, setWhoPay] = useState("user");
  const friendPay = bill - yourPay;
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !yourPay) return;
    onSplitBill(whoPay === "user" ? friendPay : -friendPay);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {selectFriend.name}</h2>
      <label> Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(e.target.value)}
      />
      <label>You pay</label>
      <input
        type="text"
        value={yourPay}
        onChange={(e) =>
          setYourPay(Number(e.target.value) > bill ? bill : e.target.value)
        }
      />
      <label>{selectFriend.name} pay</label>
      <input type="text" disabled value={friendPay} />
      <label>Кто платит за счёт?</label>
      <select value={whoPay} onChange={(e) => setWhoPay(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}

export default App;
