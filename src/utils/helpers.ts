/**
 * Computes the instant volume of the audio signal using the root mean square (RMS) method.
 */

export const getInstantVolume = (
	bufferLength: number,
	dataArray: Uint8Array,
	analyser: AnalyserNode,
): number => {
	analyser.getByteTimeDomainData(dataArray);

	let sum = 0;
	for (let i = 0; i < bufferLength; i++) {
		const amplitude = dataArray[i] / 128 - 1;
		sum += amplitude * amplitude;
	}

	const rms = Math.sqrt(sum / bufferLength);
	const instantVolume = rms * 100;

	return instantVolume;
};

/**
 * Computes a simplified LUFS value of the audio signal based on the root mean square (RMS) value.
 */
export const getSimpleInstantLUFS = (rms: number): number => {
	return 20 * Math.log10(rms || Number.EPSILON);
};
