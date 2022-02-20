exports.getDay = () => {
    let today = new Date();
    const options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    return day = today.toLocaleDateString("en-us", options);
};