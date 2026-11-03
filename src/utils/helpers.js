// storing non - react funtion in here

//removing standhartd html tag from text to sting
export const stripHtml = (rawString) => {
    if(!rawString) return "No Description Available";
    return rawString.replace(/<\/?[^>]+(>|$)/g, "");
};

//returning a fall back value if the the data is missing
export const getFallBack = (value, fallbackText = "Not Available") =>{
    if(value === null || value === undefined || value === ""){
        return fallbackText;

}
return value;
};