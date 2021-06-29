const dotenv = require('dotenv');
const colors = require('colors');
const mongoose = require('mongoose');
const fs = require('fs');

//Load env vars
dotenv.config({ path: './config/config.env' })

//Load models
const Bootcamp = require('./models/Bootcamp')

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
	useUnifiedTopology: true,
});

//Read JSON Files
const bootcamps = JSON.parse(
	fs.readdirSync(`{__dirname}/_data/bootcamps.json`, 'utf-8')
);

//Import into DB
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        console.log('Data Imported ...'.green.inverse)
        process.exit();
    } catch (error) {
        console.log(error)
    }
}

//Delete data
const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log('Data Deleted ...'.red.inverse);
		process.exit();
	} catch (error) {
		console.log(error);
	}
};

if (process.argv[2] === '-i') {
    importData();
}