import librosa
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import axes3d
import matplotlib.cm as cm
import numpy as np
from sklearn.manifold import TSNE

from os import listdir
from os.path import join

def extract_feature(song_name):
	y, sr = librosa.core.load(song_name)
	m = librosa.feature.mfcc(y=y, sr=sr, n_fft=sr).T
	num = min(m.shape[0], 100)
	features = m[np.random.choice(np.arange(m.shape[0]), num, replace=False)].tolist()
	return features

genres = ["plainchant", "baroque", "classical", "classical-romantic", "romantic", "20th and 21st"]
num_genres = len(genres)
chosen_song = "Blue_Cathedral"
music_base = "music"

print("Extracting features from songs...")
color = 0
song_features = []
colors = []
for genre in genres:
	genre_path = join(music_base, genre)
	songs = listdir(genre_path)
	for song in songs:
		print("\tExtracting: {0}".format(song))
		try:
			features = extract_feature(join(genre_path, song))
		except:
			print("\t\tFailed to load song..")
			continue
		song_features += features
		colors += [color] * len(features)
	color += 1

features = extract_feature(join(music_base, chosen_song))
song_features += features
colors += [color] * len(features)

song_features = np.array(song_features)
colors = np.array(colors)
d = {'song_features': song_features, 'colors':colors}
np.save("frame_features.npy", d)

print("Fitting features into embedding space...")
model = TSNE(n_components=2)
embeddedX = model.fit_transform(song_features)

# c = cm.rainbow(np.linspace(0, 1, num_genres + 1))
c = ['r', 'b', 'g', 'y', 'c', 'm', 'k']

print("Plotting features...")
plt.figure()
ax = plt.subplot(111)
for i in range(num_genres):
	indices = colors == i
	genreX = embeddedX[indices]
	plt.scatter(genreX[:, 0], genreX[:, 1], color=c[i], label=genres[i])


indices = colors == num_genres
songX = embeddedX[indices]
plt.scatter(songX[:, 0], songX[:, 1], color=c[num_genres], label=chosen_song)
box = ax.get_position()
ax.set_position([box.x0, box.y0, box.width * 0.70, box.height])
ax.legend(loc='center left', bbox_to_anchor=(1, 0.5))
plt.show()


print("Fitting features into embedding space...")
model = TSNE(n_components=3, random_state=0)
embeddedX = model.fit_transform(song_features)

print("Plotting features...")
fig = plt.figure()
ax = fig.add_subplot(111, projection='3d')
for i in range(num_genres):
	indices = colors == i
	genreX = embeddedX[indices]
	ax.scatter(genreX[:, 0], genreX[:, 1], genreX[:, 2], c=c[i], label=genres[i])


indices = colors == num_genres
songX = embeddedX[indices]
ax.scatter(songX[:, 0], songX[:, 1], songX[:, 2], c=c[num_genres], label=chosen_song)
box = ax.get_position()
ax.set_position([box.x0, box.y0, box.width * 0.70, box.height])
ax.legend(loc='center left', bbox_to_anchor=(1, 0.5))
plt.show()
