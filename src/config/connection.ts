import "reflect-metadata";

import {myDataSource} from "./app-data-source.ts";

export const testConnection = async() => {
	try {
		await myDataSource.initialize();
		console.log("Data source has been initialized")
	}catch(error){
		console.error("Error during db init:", error)
	}	
}
