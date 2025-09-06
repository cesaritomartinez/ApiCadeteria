const getISODate = () => {
    const date = new Date().toISOString(); //string 2025-09-02T23:27:11.235Z
    return date.split("T")[0]; //2025-09-02
}

module.exports = { getISODate }