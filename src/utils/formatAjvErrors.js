
export const formatAjvErrors = (errors = []) => {
    return errors.map((err) => {
        const raw = err.instancePath || "";

        const field = raw
            .replace(/^\//, "")               
            .replace(/\/(\d+)/g, "[$1]")      
            .replace(/\//g, ".")          
            || "body";                       

      
        const message =
            err.keyword === "required"
                ? `${field === "body" ? "" : field + "."}${err.params.missingProperty} is required`
                : err.message;

        return { field, message };
    });
};
