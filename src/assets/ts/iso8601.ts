export function fromCompact(str1: string): Date {
    const reformat = (str: string) => {
        return str.replace(
            /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/,
            '$1-$2-$3T$4:$5:$6Z'
        );
    };
    return new Date(reformat(str1))
}
