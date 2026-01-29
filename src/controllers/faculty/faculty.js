import * as facultyModel from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res) => {
    // 1. Grab the sort parameter from the URL query string
    const sortBy = req.query.sort;

    // 2. Call your model function
    const facultyArray = facultyModel.getSortedFaculty(sortBy);

    // 3. Render the list view and pass the data
    res.render('faculty/list', {
        title: 'Faculty Directory',
        facultyArray // This is the array we just got from the model
    });
};

const facultyDetailPage = async (req, res, next) => {
    // 1. Grab the ID from the URL parameters
    const facultyId = req.params.facultyId;

    // 2. Call your model function
    const member = facultyModel.getFacultyById(facultyId);

    // 3. Error Handling: If the member doesn't exist, send it to the 404 handler
    if (!member) {
        const err = new Error('Faculty member not found');
        err.status = 404;
        return next(err); // This skips to your error middleware
    }

    // 4. If they DO exist, render the detail view
    res.render('faculty/detail', {
        title: member.name,
        member // Pass the single faculty object to the view
    });
};

export { facultyListPage, facultyDetailPage };