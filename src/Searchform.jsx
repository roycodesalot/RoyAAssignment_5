function Searchform({textValue, OnTextChange, handleSubmitting}) {
    //making the text box of the searching of shows
    //with a search button for user to click

  return (
    <div>
        {/*creating a sumbit trigger */}
        <form onSubmit = {handleSubmitting}>
             {/*value binging and keystroke listning */}
            <input
            type = "text"
            value = {textValue}
            onChange ={(e) => OnTextChange(e.target.value)}
            placeholder="Search Here..."
            />
            <button type = "submit">Submit</button>
      </form>
    </div>
  )
}

export default Searchform