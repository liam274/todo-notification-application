const $ = (e) => document.querySelector(e),
    log = console.log;
let storage = {};
class TimeDelta {
    constructor(givenDateStr) {
        this.givenDate = (new Date(givenDateStr));
        this.now = new Date();
        this.diffMs = this.givenDate - this.now;
    }

    toString() {
        let remaining = this.diffMs;

        const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
        remaining -= days * (1000 * 60 * 60 * 24);

        const hours = Math.floor(remaining / (1000 * 60 * 60));
        remaining -= hours * (1000 * 60 * 60);

        const minutes = Math.floor(remaining / (1000 * 60));
        remaining -= minutes * (1000 * 60);

        const seconds = Math.floor(remaining / 1000);

        return `${days} day${days !== 1 ? "s" : ""}, ` +
            `${hours} hour${hours !== 1 ? "s" : ""}, ` +
            `${minutes} minute${minutes !== 1 ? "s" : ""}, ` +
            `${seconds} second${seconds !== 1 ? "s" : ""}`;
    }
}
function isLocalStorage() {
    let l = JSON.parse(localStorage.getItem("todoList") ?? "");
    return Object.keys(l).length != 0;
}
function viewLocalStorage() {
    return localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : false;
}
function saveToLocalStorage(todoList) {
    localStorage.setItem("todoList", JSON.stringify(todoList));
    log("Todo list saved to local storage.");
}

function update() {
    let sum = 0, total = 0;
    for (let i in storage) {
        total++;
        if (storage[i].isDone) sum++;
    }
    complement.innerHTML = `Complement: ${(sum / total * 100).toFixed(2)}%`;
}

addTodoButton.addEventListener("click", () => {
    addTodo.style.display = "flex";
});

deleteTodoButton.addEventListener("click", () => {
    deleteTodo.style.display = "flex";
    for (let i in storage) {
        let a = document.createElement("option");
        a.value = i;
        a.innerHTML = i;
        deleteTitle.appendChild(a);
    }
});

newTodo.addEventListener("click", () => {
    let title = newTitle.value,
        text = newContent.value,
        date = newDate.value;
    if (!(title && text && date)) return;
    if (title in storage && !confirm("Are you fine with covering the previous record under the same title?")) return;
    addTodo.style.display = "none";
    storage[title] = {
        title: title,
        text: text,
        date: date,
        isDone: false
    };
    saveToLocalStorage(storage);
    update();
    todo.innerHTML = "<h1 id=\"noTodo\"> Sorry, but we can't find any todo</h1>";
    show();
    newTitle.value = "";
    newContent.value = "";
    newDate.value = "";
});

exit.addEventListener("click", () => {
    addTodo.style.display = "none";
});

lossTodo.addEventListener("click", () => {
    let v = deleteTitle.value;
    if (!v) return;
    deleteTodo.style.display = "none";
    delete storage[v];
    saveToLocalStorage(storage);
    update();
    todo.innerHTML = "<h1 id=\"noTodo\"> Sorry, but we can't find any todo</h1>";
    show();
});
exitDelete.addEventListener("click", () => {
    deleteTodo.style.display = "none";
    deleteTodo.innerHTML = "";
});
document.querySelectorAll('#filter input[name="filter"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        let selected = e.target.value;
        todo.innerHTML = "<h1 id=\"noTodo\"> Sorry, but we can't find any todo</h1>";
        show(selected);
    });
});


function renderTodo(givenTitle, text, date, isDone) {
    const refer = document.createElement("a");
    refer.href = `query.html?referTo=${givenTitle}`;
    refer.target = "_blank";
    const temp = document.createElement("div");
    temp.classList.add("todo");
    temp.for = "";
    const title = document.createElement("h1");
    title.innerHTML = givenTitle;
    title.classList.add("title");
    temp.appendChild(title);
    const content = document.createElement("span");
    content.classList.add("intro");
    content.innerHTML = text;
    temp.appendChild(content);
    const div = document.createElement("div");
    div.classList.add("addtional-information");
    temp.appendChild(div);
    const edate = document.createElement("span");
    edate.classList.add("date");
    edate.innerHTML = "Time Remaining: " + (new TimeDelta(date)) + "<br />Deadline: " + date;
    div.appendChild(edate);
    const done = document.createElement("input");
    done.type = "checkbox";
    done.addEventListener("click", function () {
        for (let i in storage) {
            if (i === title.innerHTML) storage[i].isDone = done.checked;
        }
        saveToLocalStorage(storage);
        update();
    })
    if (isDone) done.checked = "true";
    div.appendChild(done);

    todo.appendChild(refer);
    refer.appendChild(temp);
}
function show(selection = "all") {
    if (!isLocalStorage()) {
        noTodo.style.display = "block";
        return;
    }
    storage = viewLocalStorage();
    update();
    if (selection === "all")
        for (let i in storage) renderTodo(storage[i].title, storage[i].text,
            storage[i].date, storage[i].isDone);
    else if (selection === "actived") {
        for (let i in storage) if (!storage[i].isDone) renderTodo(storage[i].title, storage[i].text,
            storage[i].date, false);
    } else
        for (let i in storage) if (storage[i].isDone) renderTodo(storage[i].title, storage[i].text,
            storage[i].date, true);
    if (todo.innerHTML == "<h1 id=\"noTodo\"> Sorry, but we can't find any todo</h1>")
        noTodo.style.display = "block";
}
show();