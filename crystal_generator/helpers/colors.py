COLORS = {
	'aqua': "#00ffff",
	#'black': "#000000",
	'blue': "#0000ff",
	'fuchsia': "#ff00ff",
	'gray': "#808080",
	'green': "#008000",
	'lime': "#00ff00",
	'maroon': "#800000",
	'navy': "#000080",
	'olive': "#808000",
	'purple': "#800080",
	'red': "#ff0000",
	'silver': "#c0c0c0",
	'teal': "#008080",
	'white': "#ffffff",
	'yellow': "#ffff00",
}


# h = input('Enter hex: ').lstrip('#')
# print('RGB =', tuple(int(h[i:i+2], 16) for i in (0, 2, 4)))

def convert_to_rgb(hex):
    hex = hex.lstrip('#')

    rgb = [int(hex[i:i+2], 16) for i in (0, 2, 4)]

    #print('RGB =', rgb)
    return rgb

RGB_COLORS = {}
for key in COLORS:
    RGB_COLORS[key] = convert_to_rgb(COLORS[key])