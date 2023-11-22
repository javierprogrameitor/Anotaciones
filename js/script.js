function startBD() {
    let request = window.indexedDB.open("notas");
    request.addEventListener("error", viewError);
    request.addEventListener("success", startBDSuccess);
    request.addEventListener("upgradeneeded", wareHouse);
}

function viewError(event) {
    alert("Error: " + event.code + " - " + event.message);
}

function startBDSuccess(event) {
    bd = event.target.result;
    console.log("Base de datos abierta");
}

function wareHouse(event) {
    let ddbb = event.target.result;

    if (!ddbb.objectStoreNames.contains("Anotaciones")) {
        let objectStore = ddbb.createObjectStore("Anotaciones", { keyPath: "id", autoIncrement: true });
        objectStore.createIndex("Notes", "noteText", { unique: false }); // Change 
        console.log("Base de datos creada");
    }
}

function addNoteToDB(note) {
    let transaction = bd.transaction(["Anotaciones"], "readwrite");
    let objectStore = transaction.objectStore("Anotaciones");
    let request = objectStore.add(note);

    request.addEventListener("success", function () {
        console.log("Nota agregada a la base de datos");
    });

    request.addEventListener("error", function () {
        console.log("Error al agregar nota a la base de datos");
    });
}


    document.addEventListener('DOMContentLoaded', function () {
        let btnAddNote = document.getElementById('btnAddNote');
        let btnRemoveAll = document.getElementById('btnRemoveAll');
        let notesContainer = document.getElementById('notesContainer');
    
        btnAddNote.addEventListener('click', function () {
            let note = document.createElement('div');
            note.classList.add('note');
    
            let textarea = document.createElement('textarea');
            textarea.placeholder = 'Escribe tu nota...';
    
            let btnRemoveNote = document.createElement('button');
            btnRemoveNote.textContent = 'Eliminar Nota';
    
            btnRemoveNote.addEventListener('click', function () {
                notesContainer.removeChild(note);
            });
    
            note.appendChild(textarea);
            note.appendChild(btnRemoveNote);
    
            notesContainer.appendChild(note);
    
            // Guardar la nota cuando el textarea pierde el foco
            textarea.addEventListener('blur', function () {
                let noteText = textarea.value;
                addNoteToDB({ noteText: noteText });
            });
        });
    
        btnRemoveAll.addEventListener('click', function () {
            notesContainer.innerHTML = '';
        });
    });
window.addEventListener("load", startBD);