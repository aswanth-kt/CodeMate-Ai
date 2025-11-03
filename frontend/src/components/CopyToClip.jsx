import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const CopyToClip = ({textToCopy}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
    }
    return (
        <div className='absolute right-2 top-2 rounded-xl' >
            <FontAwesomeIcon icon={faCopy} onClick={handleCopy}/>
        </div>
    )
}

export default CopyToClip;