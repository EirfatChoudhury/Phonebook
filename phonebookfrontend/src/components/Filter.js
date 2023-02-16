const Filter = ( {value, handleChange, set} ) => <input value={value} onChange={handleChange(set)}/>

export default Filter