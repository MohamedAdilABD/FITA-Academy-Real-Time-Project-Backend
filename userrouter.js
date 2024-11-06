const express = require('express');
const multer = require('multer');
const router = express.Router();
const userdata = require('./usermodul');
const placement = require('./placementmodul');
const recruiter = require('./recruitermodul');
const institution = require('./institutionmodul');
const testdata = require('./testmodul');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

//registration route
router.post('/register', upload.fields([{ name: 'resume' }, { name: 'photo' }]), async(req, res) => {
    const { name, email, phone, qualification, passingoutyear, course, expreience, position, portfoliolink } = req.body;
    const resume = req.files['resume'] ? req.files['resume'][0].filename : null;
    const photo = req.files['photo'] ? req.files['photo'][0].filename : null;

    try{
        const newuser = new userdata({ name, email, phone, qualification, passingoutyear, course, expreience, position, portfoliolink, resume, photo });
        await newuser.save();
        return res.status(200).json({ message: "User Added", data: newuser });
    }
    catch (error) {
        if (error.name === 'validationError') {
            const errormessages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: "validation error", errors: errormessages });
        }
        if (error.code === 11000) {
            return res.status(401).json({ message: "Duplicate Email Address" });
        }
        return res.status(500).json({ message: "Something Went Wrong", error: error.message });
    }
});

//check user
router.post('/check', async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkuser = await userdata.findOne({ email, password });

        if (checkuser) {
            return res.status(200).json({ message: "User found" });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// update user
router.post('/update', upload.fields([{ name: 'resume' }, { name: 'photo' }]), async (req, res) => {
    const { email, name, phone, qualification, passingoutyear, course, expreience, position, portfoliolink } = req.body;
    const resume = req.files['resume'] ? req.files['resume'][0].filename : null;
    const photo = req.files['photo'] ? req.files['photo'][0].filename : null;

    try {
        const updatadata = await userdata.findOneAndUpdate(
            { email },
            { $set: { name, phone, qualification, passingoutyear, course, expreience, position, portfoliolink, ...course(resume && { resume }), ...(photo && { photo })} },
            { new: true, runValidators: true }
        );

        if (updatadata) {
            return res.status(200).json({ message: "User Updated", user: updatedata });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: "Server error", error:error.message });
    }

});


// delete user
router.delete('/delete', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const deleteuser = await userdata.findOneAndDelete({ email });

        if (deleteuser) {
            return res.status(200).json({ message: "User Deleted" });
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
});


// get all users
router.get('/', async (req, res) => {
    console.log('Get request to fetch all user data');
    try{
        const alldata = await userdata.find();
        if(alldata.length > 0) {
            return res.status(200).json({ message: alldata });
        } else {
            return res.status(404).json({ message:"No data found" });
        }
    }
    catch (error) {
        console.error("Error fetching user data", error);
        return res.status(500).json({ message: error.message });
    }
});



// placement curd ----------------------------------------------

// placement route
router.post('/placement', upload.single('photo'), async (req, res) => {
    const { name, placementcompany, position, course } = res.body;
    const photo = res.file ? req.file.filename : null;

    if (!name || !placementcompany || !position || !course || !photo) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newplacement = new placement({ name, placementcompany, position, course, photo });
        await newplacement.save();
        return res.status(200).json({ message: "Placement Added", data: newplacement });
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding placement", error: error.message });
    }
});


// get all placement
router.get('/allplacement', async (req, res) => {
    try {
        const allplacement = await placement.find();
        return res.status(200).json({ message: allplacement.length > 0 ? allplacement : "No placement found" });
    }
    catch (error) {
        console.error("Error fetching placement:", error);
        return res.status(500).json({ message: error.message });
    }
});


// update a placement by id
router.put('/placement/update/:id', upload.single('photo'), async (req, res) => {
    const { id } = req.params;
    const { placementcompany, position, course } = req.body;
    let photo;
    
    if (req.file) {
        photo = req.file.filename;
    }

    try {
        const placement = await placement.findById(id);
        if (!placement) {
            return res.status(404).json({ message: "placement not found" });
        }

        //update fields
        placement.placementcompany = placementcompany || placement.placementcompany;
        placement.position = position || placement.position;
        placement.course = course || placement.course;

        if (photo) {
            placement.photo = photo;
        }
        await placement.save();
        return res.status(200).json({ message: "placement updated", data: placement });
    }
    catch (error) {
        return res.status(500).json({ message: "Error updating placement", error: error.message });
    }
});


// delete a placement bt id
router.delete('/placement/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const placement = await placement.findByIdAndDelete(id);
        if (!placement) {
            return res.status(404).json({ message: "placement not found" });
        }
        return res.status(200).json({ message: "placement deleted" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting placement", error: error.message });
    }
});




//recruiter curd ------------------------------------

//create recruiter
router.post('/recruiter', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fielsd are required" });
    }

    try {
        const newrecruiter = new recruiter({ email, password });
        await newrecruiter.save();
        return res.status(200).json({ message: "Recruiter created successfully", data: newrecruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding recuiter", error: error.message });
    }
});


// delete recruiter
router.delete('/recruiterdelete', async (req, res) => {
    const { email } = req.body;

    try {
        const deleterecruiter = await recruiter.findOneAndDelete({ email });

        if (!deleterecruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        return res.status(200).json({ message: "Recruiter delete successfully", data: deleterecruiter });
    }
    catch (error) {
        return  res.status(500).json({ message: "Error deleting recruiter", error: error.message });
    }
});


// find recruiter
router.post('/recruitercheck', async (req, res) => {
    const { email } = req.body;

    try{
        const recuiter = await recruiter.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        return res.status(200).json({ message: "Recruiter exists", data: recruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Errro checking recruiter", error: error.message });
    }
});


// recruiter login
router.post('/recruiterlogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const recruiter = await recruiter.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        if (recruiter.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Login Successful", data: recruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }
});


//institution curd -------------------------------------------------------

// create institution
router.post('/institution', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newrecruiter = new institution({ email, password });
        await newrecruiter.save();
        return res.status(200).json({ message: "Recuiter created successfully", data: newrecruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding recruiter", error: error.message });
    }
});


// delete institution
router.delete('/institutiondelete', async (req, res) => {
    const { email } = req.body;

    try {
        const deleterecruiter = await institution.findOneAndDelete({ email });

        if (!deleterecruiter) {
            return res.status(404).status({ message: "Recruiter not found" });
        }

        return res.status(200).json({ message: "Recruiter deleted successfully", data: deleterecruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Errro deleting recruiter", error: error.message });
    }

});


// check institution
router.post('/institutioncheck', async (req, res) => {
    const { email } = req.body;

    try {
        const recruiter = await institution.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({ message: "REcruiter not found" });
        }

        return res.status(200).json({ message: "Recruiter exists", data: recruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Error checking recruiter", error: error.message });
    }
});


// login institution
router.post('/institutionlogin', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required "});
    }

    try {
        const recruiter = await institution.findOne({ email });

        if (!recruiter) {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        if (recruiter.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        return res.status(200).json({ message: "Login successfully", data: recruiter });
    }
    catch (error) {
        return res.status(500).json({ message: "Error loggin in", error: error.message });
    }
});


// testimonal curd -----------------------------------------------------------------------

// create testimonal
router.post('/test', upload.single('photo'), async (req, res) => {
    const { name, course, textarea, status } = req.body;
    const photo = req.file ? req.file.filename : null;

    if (!name || !course || !textarea ||!photo || status) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newtestdata = new testdata({ name, course, photo, textarea });
        await newtestdata.save();
        return res.status(200).json({ message: "Testimonal created successfully", data: newtestdata });
    }
    catch (error) {
        return res.status(500).json({ message: "Error adding testdata", error: error.message });
    }
});



// find all  testimonal 
router.get('/testall', async (req, res) => {
    try {
        const testdata = await testdata.find();
        const formatteddata = testdata.map(item => ({
            ...item.toObject(),
            photo: item.photo ? `http://localhost:5000/uploads/${item.photo}` : null
        }));
        res.status(200).json(formatteddata);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieveing test entries", error: error.message });
    }
});


// find by id testimonal
router.get('/test/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const testdata = await testdata.findById(id);

        if (!testdata) {
            return res.status(404).json({ message: "Test entry not found" });
        }

        res.status(200).json(testdata);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving test entry", error: error.message });
    }
});


// update testimonal
router.put('/updatestatus/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(status)

    if (status !== 0 && status !== 1) {
        return res.status(400).json({ message: "Status must be either 0 or 1" });
    }

    try {
        const updatedtestdata = await testdata.findByIdAndUpdate(id, { status }, { new: true });

        if (!updatedtestdata) {
            return res.status(404).json({ message: "Test entry not found" });
        }

        return res.status(200).json({ message: "Test entry status updated successfully", data: updatedtestdata });
    }
    catch (error) {
        console.error("Error updating test entry status:", error);
        return res.status(500).json({ message: "Error updating test entry status", error: error.message });
    }
});


// delete by id testimonal
router.delete('/testdelete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedtestdata = await testdata.findByIdAndDelete(id);

        if (!deletedtestdata) {
            return res.status(404).json({ message: "Test entry not found" });
        }

        return res.status(200).json({ message: "Test entry deleted successfully", data: deletedtestdata });
    }
    catch (error) {
        return res.status(500).json({ message: "Error deleting test entry", error: error.message });
    }
});


// check testimonal
router.post('/testckeck', async (req, res) => {
    const { name } = req.body;

    try {
        const testdata = await testdata.findOne({ name });

        if(!testdata) {
            return res.status(404).json({ message: "Test entry not found" });
        }

        return res.status(200).json({ message: "Test entry exists", data: testdata });
    }
    catch (error) {
        return res.status(500).json({ message: "Error checking test entry", error: error.message });
    }
});


// login testimonal
router.post('/testlogin', async (req, res) => {
    const { name, testarea } = req.body;

    if (!name || !testarea) {
        return res.status(400).json({ message: "Name and feedback are required" });
    }

    try {
        const testdata = await testdata.findOne({ name });

        if (!testdata) {
            return res.status(404).json({ message: "Test entry not found" });
        }

        if(testdata.testarea !== testarea) {
            return res.status(401).json({ message: "Invalid feedback" });
        }

        return res.status(200).json({ message: "Login successfull", data: testdata });
    }
    catch (error) {
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }
});



module.exports = router;