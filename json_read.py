import json
import urllib.request

f =open('santa-cruz-nature-team-retreat.json')

data = json.load(f)

new_data = data["agenda"]

s3_Links = []
for i in new_data:
   i.pop("events")

for i in new_data:
    s3_Links.append(i)

for i,image_url in enumerate(s3_Links):
    s3_url = "https://retrera-images.s3.us-west-2.amazonaws.com/" + str(image_url["image"])
    #print(i, s3_url)
    save_name = "image " + str(i+1) 
    urllib.request.urlretrieve(s3_url, save_name)

#image_url = "https://retrera-images.s3.us-west-2.amazonaws.com/santa-cruz-nature-team-retreat/3a83c51e-3eb1-4b00-8cec-cde879d3246b.jpeg"
#save_name = "image 1"
#urllib.request.urlretrieve(image_url, save_name)

    





f.close()
