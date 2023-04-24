const Content = ( {persons, newFilter, onClick} ) => {
    const contentToShow = persons
        .filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))
        .map(person => <p>{person.name} {person.number} <button id={person.id+"button"} onClick={onClick(person.id)}>Delete</button></p>)

    return (contentToShow)
}


export default Content