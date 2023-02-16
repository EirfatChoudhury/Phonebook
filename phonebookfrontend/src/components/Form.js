import Filter from './Filter'

const Form = ( {onSubmit, value1, value2, handleChange, set1, set2} ) => {
    return(
        <form onSubmit={onSubmit}>
        <div>
          name: <Filter value={value1} handleChange={handleChange} set={set1}/>
        </div>
        <div>
          number: <Filter value={value2} handleChange={handleChange} set={set2}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default Form