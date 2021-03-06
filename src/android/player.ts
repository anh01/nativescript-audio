import {isString} from 'utils/types';
import {TNSPlayerI} from '../common';
import {AudioPlayerOptions} from '../options';
import * as app from 'application';
import * as utils from 'utils/utils';
import * as fs from 'file-system';
import * as enums from 'ui/enums';

export class TNSPlayer implements TNSPlayerI {
  private player: any;

  constructor() {
    this.player = new android.media.MediaPlayer();
  }  

  public playFromFile(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let MediaPlayer = android.media.MediaPlayer;
        let audioPath;

        let fileName = isString(options.audioFile) ? options.audioFile.trim() : "";
        if (fileName.indexOf("~/") === 0) {
          fileName = fs.path.join(fs.knownFolders.currentApp().path, fileName.replace("~/", ""));
          console.log('fileName: ' + fileName);
          audioPath = fileName;
        }
        else {
          audioPath = fileName;
        }

        this.player = new MediaPlayer();
          
        this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);         
        this.player.setDataSource(audioPath);
        this.player.prepareAsync();

        // On Complete
        if (options.completeCallback) {
          this.player.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
            onCompletion: (mp) => {
              options.completeCallback();
            }
          }));
        }

        // On Error
        if (options.errorCallback) {
          this.player.setOnErrorListener(new MediaPlayer.OnErrorListener({
            onError: (mp: any, what: number, extra: number) => {
              options.errorCallback();
              return true;
            }
          }));
        }

        // On Info
        if (options.infoCallback) {
          this.player.setOnInfoListener(new MediaPlayer.OnInfoListener({
            onInfo: (mp: any, what: number, extra: number) => {
              options.infoCallback();
              return true;
            }
          }))
        }

        // On Prepared
        this.player.setOnPreparedListener(new MediaPlayer.OnPreparedListener({
          onPrepared: (mp) => {
            mp.start();
            resolve();
          }
        }));

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public playFromUrl(options: AudioPlayerOptions): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let MediaPlayer = android.media.MediaPlayer;

        this.player = new MediaPlayer();
          
        this.player.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
        this.player.setDataSource(options.audioFile);
        this.player.prepareAsync();

        // On Complete
        if (options.completeCallback) {
          this.player.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
            onCompletion: (mp) => {
              options.completeCallback();
            }
          }));
        }

        // On Error
        if (options.errorCallback) {
          this.player.setOnErrorListener(new MediaPlayer.OnErrorListener({
            onError: (mp: any, what: number, extra: number) => {
              options.errorCallback();
              return true;
            }
          }));
        }

        // On Info
        if (options.infoCallback) {
          this.player.setOnInfoListener(new MediaPlayer.OnInfoListener({
            onInfo: (mp: any, what: number, extra: number) => {
              options.infoCallback();
              return true;
            }
          }))
        }

        // On Prepared
        this.player.setOnPreparedListener(new MediaPlayer.OnPreparedListener({
          onPrepared: (mp) => {
            mp.start();
            resolve();
          }
        }));

      } catch (ex) {
        reject(ex);
      }
    });
  }

  public pause(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.player.isPlaying()) {
          console.log('PAUSE');
          this.player.pause();
          resolve(true);
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public play(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (!this.player.isPlaying()) {
          console.log('RESUME');
          this.player.start();
          resolve(true);
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }  

  public seekTo(time: number): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        if (this.player) {
          console.log(`seek to: ${time}`);
          this.player.seekTo(time);
          resolve(true);
        }
      } catch (ex) {
        reject(ex);
      }
    });
  }  

  public dispose(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        this.player.release();
        resolve();
      } catch (ex) {
        reject(ex);
      }
    });
  }

  public isAudioPlaying(): boolean {
    return this.player.isPlaying();
  }

  public getAudioTrackDuration(): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        var duration = this.player.getDuration();
        resolve(duration.toString());
      } catch (ex) {
        reject(ex);
      }
    });
  }
}

// TODO: convert this into above

// export var playFromResource = function(options: definition.AudioPlayerOptions): Promise<any> {
//     return new Promise((resolve, reject) => {
//         try {
//             var audioPath;

//             var res = utils.ad.getApplicationContext().getResources();
//             var packageName = utils.ad.getApplication().getPackageName();
//             var identifier = utils.ad.getApplicationContext().getResources().getIdentifier("in_the_night", "raw", packageName);
//             console.log(identifier);
//             console.log(packageName);
//             console.log(res);
//             if (res) {
//                 var resourcePath = "android.resource://" + packageName + "/raw/" + options.audioFile;
//                 audioPath = resourcePath;
//             }

//             var mediaPlayer = new MediaPlayer();
//             mediaPlayer.setAudioStreamType(android.media.AudioManager.STREAM_MUSIC);
//             mediaPlayer.setDataSource(audioPath);
//             mediaPlayer.prepareAsync();

//             // On Complete            
//             if (options.completeCallback) {
//                 mediaPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener({
//                     onCompletion: function(mp) {
//                         options.completeCallback();
//                     }
//                 }));
//             }

//             // On Error
//             if (options.errorCallback) {
//                 mediaPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener({
//                     onError: function(mp: any, what: number, extra: number) {
//                         options.errorCallback({ msg: what, extra: extra });
//                     }
//                 }));
//             }

//             // On Info
//             if (options.infoCallback) {
//                 mediaPlayer.setOnInfoListener(new MediaPlayer.OnInfoListener({
//                     onInfo: function(mp: any, what: number, extra: number) {
//                         options.infoCallback({ msg: what, extra: extra });
//                     }
//                 }))
//             }

//             // On Prepared - this resolves and returns the android.media.MediaPlayer;
//             mediaPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener({
//                 onPrepared: function(mp) {
//                     mp.start();
//                     resolve(mp);
//                 }
//             }));

//         } catch (ex) {
//             reject(ex);
//         }
//     });
// }