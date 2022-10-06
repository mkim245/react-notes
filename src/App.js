import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import { data } from "./data"
import {nanoid} from "nanoid"
import "react-mde/lib/styles/css/react-mde-all.css";
import "./style.css";
import Split from "react-split"

export default function App() {

    const [notes, setNotes] = React.useState(  
      () =>  JSON.parse(localStorage.getItem("notes")) || []
    )
    const [currentNoteId, setCurrentNoteId] = React.useState(
        (notes[0] && notes[0].id) || ""
    )
    React.useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes))
        // console.log(notes[1].body.split("\n"))
    }, [notes])

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        }
        setNotes(prevNotes => [newNote, ...prevNotes])
        setCurrentNoteId(newNote.id)
    }
    
    function updateNote(text) {
        // put the most recently-modified note at the top
        setNotes(oldNotes => {
            const newArray = []  // create e new empty array
            for (let i = 0; i < oldNotes.length; i++) { // loop over the original array
                const oldNote = oldNotes[i]
                if(oldNote.id === currentNoteId) { // if the id matches
                    newArray.unshift({...oldNote, body: text })
                } else {
                    newArray.push(oldNote)
                }
            }
            return newArray
        })
    }

    function deleteNote(event, noteId) {
        event.stopPropagation()
        console.log("delete note", noteId)
        setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
        
        // callback function oldNotes is parameters, return new array with result which is oldNotes.filter
        // filter takes callback function, whatever we return from callback function is boolean to indicate whether the current item should be included in new array or not
        // if note id property (note.id) is not equal noteId, it should be included to new array
        // each note we are looking at has id and is not equal to noteId can be deleted
    }

    function findCurrentNote() {
        return notes.find(note => {
            return note.id === currentNoteId
        }) || notes[0]
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={notes}
                    currentNote={findCurrentNote()}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                {
                    currentNoteId && 
                    notes.length > 0 &&
                    <Editor 
                        currentNote={findCurrentNote()} 
                        updateNote={updateNote} 
                    />
                }
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
