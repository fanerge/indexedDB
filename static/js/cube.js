let input = document.querySelector('#indexedDBName')
let createBtn = document.querySelector('#createIndexedDB')
let deleteBtn = document.querySelector('#deleteIndexedDB')
let insertBtn = document.querySelector('#insertIndexedDB')
let addBtn = document.querySelector('#addIndexedDB')
let del66Btn = document.querySelector('#del66IndexedDB')
let get66Btn = document.querySelector('#get66IndexedDB')
let update66Btn = document.querySelector('#update66IndexedDB')

createBtn.addEventListener('click', function(){
	let value = input.value
	if (value) {
		createDatabase(value)
	} else {
		console.log('请输入数据库名称')
	}
	
})

insertBtn.addEventListener('click', function(){
	let value = input.value
	if (value) {
		insertData(value)
	} else {
		console.log('请输入数据库名称')
	}
	
})

deleteBtn.addEventListener('click', function(){
	let value = input.value
	if (value) {
		deleteDatabase(value)
	} else {
		console.log('请输入数据库名称')
	}
	
})
	
addBtn.addEventListener('click', function(){
	addData('customers')
})
	
del66Btn.addEventListener('click', function(){
	del66('444-44-4444')
})

get66Btn.addEventListener('click', function(){
	getDataByKey('666-66-6666')
})

update66Btn.addEventListener('click', function(){
	updateDataByKey('666-66-6666')
})


function createDatabase(indexDbName) {
	
	// 不存在则新建，存在则打开
	let openRequest = indexedDB.open(indexDbName);
	
	openRequest.onerror = function(e) {
        console.log("Database error: " + e.target.errorCode);
    };
 
	openRequest.onsuccess = function(event) {
		console.log("Database created");
		let db = openRequest.result;
		console.log("this is :"+db);
	};
	
	//更改数据库，或者存储对象时候在这里处理
	openRequest.onupgradeneeded = function (e) {
		console.log(e);
	};
}


function deleteDatabase(indexDbName){
	
	let deleteDbRequest = indexedDB.deleteDatabase(indexDbName);
    deleteDbRequest.onsuccess = function (event) {
        console.log("detete database success");
    };
    deleteDbRequest.onerror = function (e) {
        console.log("Database error: " + e.target.errorCode);
    };
}


function insertData(indexDbName){
	// 写入
	const customerData = [
	  { ssn: "444-44-4444", name: "Bill", age: 35, email: "bill@company.com" },
	  { ssn: "555-55-5555", name: "Donna", age: 32, email: "donna@home.org" }
	];
	
	let openRequest = indexedDB.open(indexDbName, '3.0');
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	
	openRequest.onsuccess = function(event) {
		console.log("Database created");
	};
	// 这里有个坑，折腾了一晚上。
	// onupgradeneeded事件在下列情况下被触发：
	// 1.数据库第一次被打开时即新建
	// 2.打开数据库时指定的版本号高于当前被持久化的数据库版本号
	openRequest.onupgradeneeded = function(event) {
		
		console.log("Database created");
		let db = event.target.result;
		// keyPath、autoIncrement
		let objectStore = db.createObjectStore("customers", { keyPath: "ssn" });
		objectStore.createIndex("name", "name", { unique: false });
		objectStore.createIndex("email", "email", { unique: true });
		
		for (let item of customerData) {
			objectStore.add(item);
		}
		
	};
}

// 添加数据
function addData(storeName) {
	const datas = [
	  { ssn: "666-66-6666", name: "fanerge", age: 15, email: "fanerge@company.com" },
	  { ssn: "777-77-7777", name: "sdsd", age: 22, email: "sdsd@home.org" }
	];
	
	let openRequest = indexedDB.open('demo', '3.0');
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	
	openRequest.onsuccess = function(event) {
		let db = event.target.result;
		let transaction=db.transaction(storeName,'readwrite');
        let store=transaction.objectStore(storeName); 
		for(let i=0;i<datas.length;i++){
            store.add(datas[i]);
        }
	};
	
}

// 删除某条数据
function del66(key){
	let openRequest = indexedDB.open('demo', '3.0');
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	
	openRequest.onsuccess = function(event) {
		let db = event.target.result;
		let transaction = db.transaction('customers','readwrite');
		let store=transaction.objectStore('customers'); 
		let request = store.delete(key);
		
		request.onsuccess = function(event) {
			console.log('删除成功');
		};
		
		request.onerror = function(event) {
			console.log('删除失败');
		};
	};
}

function getDataByKey(key){
	let openRequest = indexedDB.open('demo', '3.0');
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	
	openRequest.onsuccess = function(event) {
		let db = event.target.result;
		let transaction = db.transaction('customers','readwrite');
		let store=transaction.objectStore('customers'); 
		let request = store.get(key);
		
		request.onsuccess = function(event) {
			let item =event.target.result; 
			console.log(item);
			console.log('查找成功');
		};
		
		request.onerror = function(event) {
			console.log('查找失败');
		};
	};
}

function getDataByIndex(idx){
	let openRequest = indexedDB.open('demo', '3.0');
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	
	openRequest.onsuccess = function(event) {
		let db = event.target.result;
		let transaction = db.transaction('customers'); // 这里只需要读
		let store=transaction.objectStore('customers'); 
		let index = store.index(idx);
		index.get('yuzhenfan').onsuccess = function (e){
			let item = e.target.result;
			console.log(item);
		};
		
	};
}

function updateDataByKey(key){
	let openRequest = indexedDB.open('demo', '3.0');
	
	openRequest.onerror = function(e) {
		console.log("Database error: " + e.target.errorCode);
	};
	
	openRequest.onsuccess = function(event) {
		let db = event.target.result;
		let transaction = db.transaction('customers','readwrite');
		let store=transaction.objectStore('customers'); 
		let request = store.get(key);
		
		request.onsuccess = function(event) {
			let item =event.target.result; 
			 // { ssn: "666-66-6666", name: "fanerge", age: 15, email: "fanerge@company.com" }
			item.ssn = "666-66-6666"
			item.name = "yuzhenfan"
			item.age = 18
			item.email = "yzf@alipay.com"
            store.put(item); 
			console.log('更新成功');
		};
		
		request.onerror = function(event) {
			console.log('更新失败');
		};
	};
}



