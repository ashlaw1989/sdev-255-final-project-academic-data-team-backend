import { courses } from "./courses";

function validateCourse(course) {
    if (
        !course.name ||
        !course.subject ||
        !course.course ||
        !course.description ||
        !course.credits ||
        !course.instructor
        ) {
            throw new Error("You must fill out all fields.");
        }

    if (isNaN(course.course) || Number(course.course) <= 0) {
        throw new Error("Course number must be greater than 0.");
    }

    if (isNaN(course.credits) || Number(course.credits) <= 0) {
        throw new Error("Credits must be greater than 0.");
    }
}

export function createCourse(newCourse) {
    validateCourse(newCourse);
    const newId = courses.length > 0
    ? Math.max(...courses.map(c => c.id)) + 1
    : 1;

    const courseAdd = {
        ...newCourse,
        id: newId
    };
    courses.push(courseAdd);
    return courseAdd;
}

export function updateCourse(id, updatedFields) {
    const index = courses.findIndex(course => course.id === id);

    if (index === -1) {
        throw new Error("Course not found.");
    }

    const updatedCourse = { ...courses[index], ...updatedFields };
    validateCourse(updatedCourse);
    courses[index] = updatedCourse;
    return updatedCourse
;
}

export function deleteCourse(id) {
    const index = courses.findIndex(course => course.id === id);

    if (index === -1) {
        throw new Error("Course not found.");
    }
    return courses.splice(index, 1)[0];
}