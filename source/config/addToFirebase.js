import { db } from '../config/db';

export const addItem = (id, latitude, longitude) => {
    db.ref(`/drivers/${id}`).set({
            'latitude': latitude,
            'longitude': longitude
    })
}