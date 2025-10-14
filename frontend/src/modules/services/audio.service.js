export class AudioService {
  static audioContext = null;
  static currentAudio = null;

  static async playAudio(audioId) {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }
      const audioPath = `/assets/audio/${audioId}.mp3`;
      const audio = new Audio(audioPath);
      
      audio.addEventListener('loadeddata', () => {
        audio.play().catch(e => console.error('Audio play failed:', e));
      });

      audio.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        this.playTTSError();
      });

      this.currentAudio = audio;
    } catch (error) {
      console.error('Audio service error:', error);
      this.playTTSError();
    }
  }

  static playTTSError() {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'Аудиогид для этой точки'
      );
      utterance.lang = 'ru-RU';
      speechSynthesis.speak(utterance);
    }
  }

  static pauseAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    speechSynthesis.cancel();
  }

  static stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    speechSynthesis.cancel();
  }
}