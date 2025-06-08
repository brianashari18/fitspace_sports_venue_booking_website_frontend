import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const addField = async (token, venueId, fieldData, files) => {
    try {
        const formData = new FormData();

        formData.append("field", JSON.stringify({
            "type": fieldData.type,
            "price": fieldData.price
        }));

        files.forEach((file) => {
            formData.append("files", file);
        });

        console.log("FormData being sent:", formData);

        const response = await axios.post(`${baseUrl}/${venueId}/fields/create`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;

    } catch (error) {
        console.error("Error adding field:", error);
        throw new Error(error.response?.data?.errors || "Failed to add field.");
    }
};

export const updateField = async (token, venueId, fieldId, fieldData) => {
    try {
        const formData = new FormData();

        formData.append("field", JSON.stringify({
            "type": fieldData.type,
            "price": fieldData.price,
            "gallery": fieldData.gallery,
            "removedImages": fieldData.removedImages,
            "field_schedules": fieldData.field_schedules,
        }));

        fieldData.newImages.forEach((file) => {
            formData.append("files", file);
        });

        for (let [key, value] of formData.entries()) {
            if (value instanceof File) {
                console.log(`${key}: [File] ${value.name}`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }

        const response = await axios.patch(
            `${baseUrl}/${venueId}/fields/${fieldId}/update`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating field:", error);
        throw new Error(error.response?.data?.errors || "Failed to update field.");
    }
};

export const deleteField = async (token, venueId, fieldId) => {
    try {
        const response = await axios.delete(`${baseUrl}/${venueId}/fields/${fieldId}/delete`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting field:", error);
        throw new Error(error.response?.data?.errors || "Failed to delete field.");
    }
};

export const getFieldById = async (token, fieldId) => {
    try {
        const response = await axios.get(`${baseUrl}/venues/fields/${fieldId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;

        // ex: response
        // {
        //     "data": {
        //     "id": 0,
        //         "venueId": 0,
        //         "price": 0,
        //         "type": "string",
        //         "fieldSchedules": [
        //         {
        //             "status": "string",
        //             "schedule": {
        //                 "id": 0,
        //                 "date": "2025-06-02",
        //                 "timeSlot": "string"
        //             }
        //         }
        //     ]
        // }
        // }
    } catch (error) {
        console.error("Error get field:", error);
        throw new Error(error.response?.data?.errors || "Failed to get field.");
    }
};

export const getAllFieldsInVenue = async (token, venueId) => {
    try {
        const response = await axios.get(`${baseUrl}/${venueId}/fields`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log('Response data:', response.data.data);
        return response.data;

        // ex: response.data
        // {
        //     "data": [
        //     {
        //         "id": 0,
        //         "venueId": 0,
        //         "price": 0,
        //         "type": "string",
        //         "fieldSchedules": [
        //             {
        //                 "status": "string",
        //                 "schedule": {
        //                     "id": 0,
        //                     "date": "2025-06-02",
        //                     "timeSlot": "string"
        //                 }
        //             }
        //         ],
        //         "reviews": [
        //             {
        //                 "id": 0,
        //                 "rating": 0
        //             }
        //         ]
        //     }
        // ]
        // }
    } catch (error) {
        console.error("Error get field:", error);
        throw new Error(error.response?.data?.errors || "Failed to gets field.");
    }
};
