const Filter = ( {value, handleChange, set, placeholder=""} ) => <input value={value} onChange={handleChange(set)} placeholder={placeholder}/>

export default Filter