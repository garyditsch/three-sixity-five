type NoteProps = {
  note: Array<string> | null | undefined;
}


const createNoteList = (data: any) => {
  const noteItems = data.map(( note: any ) => {
      return <li key={note.id}>
              <div className={"w-full"} >
                <div className="text-gray-800 text-lg">{note.note}</div>
              </div>
          </li>        
  })
  return (
      <ul className="mt-2 mx-auto text-left text-lg leading-none border-gray-300 divide-y divide-gray-300">
          {noteItems}
      </ul>
  )
}

export const Note = ({note}: NoteProps) => {
  if (note === undefined) {
    return <div className="text-gray-800 text-lg"> </div>
  }
  const notes = createNoteList(note)
  return (
    <div className="py-2">
        { notes }
    </div>
  );
}