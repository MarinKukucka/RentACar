interface Props {
    filePath: string;
    fileName: string;
}

function FileLink({ filePath, fileName }: Props) {
    return (
        <a
            onClick={(event) => event.stopPropagation()}
            href={filePath}
            target="_blank"
            rel="noopener noreferrer"
        >
            {fileName}
        </a>
    );
}

export default FileLink;
