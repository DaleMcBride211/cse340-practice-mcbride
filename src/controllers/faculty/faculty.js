import { getFacultyBySlug, getSortedFaculty } from '../../models/faculty/faculty.js';

const facultyListPage = async (req, res) => {
    const validSortOptions = ['name', 'department', 'title'];
    const sortBy = validSortOptions.includes(req.query.sort) ? req.query.sort : 'department';

    // 2. Call your model function
    const facultyArray = await getSortedFaculty(sortBy);

  

    // 3. Render the list view and pass the data
    res.render('faculty/list', {
        title: 'Faculty Directory',
        facultyArray 
    });
};

const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    

    const facultyMember = await getFacultyBySlug(facultySlug);
    

    // 3. Error Handling: If the member doesn't exist, send it to the 404 handler
    if (!facultyMember || Object.keys(facultyMember).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

  


    // 4. If they DO exist, render the detail view
    res.render('faculty/detail', {
        title: facultyMember.name,
        member: facultyMember 
    });
};

export { facultyListPage, facultyDetailPage };