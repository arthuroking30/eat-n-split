import { useState } from 'react';
const initialFriends = [
	{
		id: 118836,
		name: 'Clark',
		image: 'https://i.pravatar.cc/48?u=118836',
		balance: -7,
	},
	{
		id: 933372,
		name: 'Sarah',
		image: 'https://i.pravatar.cc/48?u=933372',
		balance: 20,
	},
	{
		id: 499476,
		name: 'Anthony',
		image: 'https://i.pravatar.cc/48?u=499476',
		balance: 0,
	},
];

export default function App() {
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	function handleShowAddFriend() {
		setShowAddFriend(showAddFriend => !showAddFriend);
		setSelectedFriend(null);
	}

	function handleAddFriend(newFriend) {
		setFriends(friend => [...friend, newFriend]);
		setShowAddFriend(false);
	}

	function handleSelection(friend) {
		setSelectedFriend(cur => (cur?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	}

	function handleSplitBill(value) {
		setFriends(friends =>
			friends.map(friend =>
				friend.id === selectedFriend.id
					? { ...friend, balance: friend.balance + value }
					: friend
			)
		);
		setSelectedFriend(null);
	}

	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					friends={friends}
					onSelection={handleSelection}
					selectedFriend={selectedFriend}
				></FriendsList>
				{showAddFriend && (
					<FormAddFriend onAddFriend={handleAddFriend}></FormAddFriend>
				)}

				<Button onClick={handleShowAddFriend}>
					{showAddFriend ? 'Close' : 'Add Friend'}
				</Button>
			</div>
			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					onSplitBill={handleSplitBill}
					key={selectedFriend.id}
				></FormSplitBill>
			)}
		</div>
	);
}

function FriendsList({ friends, onSelection, selectedFriend }) {
	return (
		<ul>
			{friends.map(friend => (
				<Friend
					friend={friend}
					key={friend.id}
					onSelection={onSelection}
					selectedFriend={selectedFriend}
				></Friend>
			))}
		</ul>
	);
}

function Friend({ friend, onSelection, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;
	return (
		<li className={isSelected ? 'selected' : ''}>
			<img src={friend.image} alt={friend.name}></img>
			<h3>{friend.name}</h3>
			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} {-friend.balance}€
				</p>
			)}
			{friend.balance > 0 && (
				<p className="green">
					{friend.name} owes you {friend.balance}€
				</p>
			)}

			{friend.balance === 0 && <p>You and {friend.name} are even</p>}

			<button className="button" onClick={() => onSelection(friend)}>
				{isSelected ? 'Close' : 'Select'}
			</button>
		</li>
	);
}

function FormAddFriend({ onAddFriend }) {
	const [name, setName] = useState('');
	const [img, setImg] = useState('https://i.pravatar.cc/48');
	function handlerSubmit(e) {
		e.preventDefault();
		if (!name || !img) return;
		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${img}?=${id}`,
			balance: 0,
		};
		onAddFriend(newFriend);
		setName('');
		setImg('https://i.pravatar.cc/48');
	}
	return (
		<form className="form-add-friend" onSubmit={handlerSubmit}>
			<label>🧑‍🤝‍🧑Friend name</label>
			<input
				type="text"
				value={name}
				onChange={e => setName(e.target.value)}
			></input>
			<label>🌇Image URL</label>
			<input
				type="text"
				value={img}
				onChange={e => setImg(e.target.value)}
			></input>
			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
	const [bill, setBill] = useState('');
	const [paidByUser, setPaidByUser] = useState('');
	const paidByFriend = bill ? bill - paidByUser : '';
	const [whoIsPaying, setWhoIsPaying] = useState('user');

	function handleSubmit(e) {
		e.preventDefault();
		if (!bill || !paidByUser) return;
		onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser);
	}

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split bill with {selectedFriend.name}</h2>
			<label>💰Bill value</label>
			<input
				type="text"
				value={bill}
				onChange={e => setBill(Number(e.target.value))}
			></input>
			<label>🧍Your expenses</label>
			<input
				type="text"
				value={paidByUser}
				onChange={e =>
					setPaidByUser(
						Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
					)
				}
			></input>
			<label>🧑‍🤝‍🧑{selectedFriend.name}'s expenses:</label>
			<input type="text" disabled="disabled" value={paidByFriend}></input>
			<label>🤑Who is paying the bill?</label>
			<select
				value={whoIsPaying}
				onChange={e => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>
			<Button>Split bill</Button>
		</form>
	);
}

function Button({ children, onClick }) {
	return (
		<button className="button" onClick={onClick}>
			{children}
		</button>
	);
}

function Input({ children, disabled, name }) {
	return (
		<>
			<label>{children}</label>
			<input type="text" disabled={disabled} name={name}></input>
		</>
	);
}
