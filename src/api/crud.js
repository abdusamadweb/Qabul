import {$adminResp} from "./apiResp.js";

// add or edit item
export const addOrEdit = async (url, value, id) => {
    const res = await $adminResp({
        url: id ? `${url}/update/${id}` : `${url}/create`,
        method: id ? "PUT" : "POST",
        data: value,
    })
    return res.data
}

// delete item
export const deleteData = async (url, id) => {
    const res = await $adminResp({
        url: `${url}/remove/${id}`,
        method: "DELETE",
    })
    return res.data
}
