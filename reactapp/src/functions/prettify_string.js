function capitalize_first_letter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prettify_string(incoming_value) {
    let output = '';

    for (let piece of incoming_value.split('_')) {
        if (output !== '') {
            output += ' ';
        }
        output += capitalize_first_letter(piece);
    }

    output = output.trim();

    return output;
}

export default prettify_string;
