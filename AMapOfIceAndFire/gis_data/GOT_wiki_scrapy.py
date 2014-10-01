from HTMLParser import HTMLParser
from itertools import izip
import urllib2
import json
import time
import ast
import os
import re

found_caption = False
found_tag = False
images_caption = []
div_count = 0
caption_text = ""

# create a subclass and override the handler methods
class MyHTMLParser(HTMLParser):

    def append_data(self):        
        global images_caption
        global caption_text        
        images_caption.append(caption_text)
    
    def handle_starttag(self, tag, attrs):        
        # IMAGES
        if tag == "img":
            for attr in attrs:               
                if attr[0] == "src":                    
                    if attr[1].startswith("/images/"):
                        if "Red_pog.png" not in attr[1]:
                            for attr_check in attrs:
                                if attr_check[0] == "height" and int(attr_check[1]) >=50:                                    
                                    global images_caption
                                    if len(images_caption)> 0:                                        
                                        if images_caption[-1].startswith("http://"):
                                            images_caption.append("")
                                    format_link = str(attr[1]).replace("/images/", "http://awoiaf.westeros.org/images/")
                                    images_caption.append(format_link)
                                                                       

        # CAPTION
        if tag == "div":
            for attr in attrs:
                if attr[0] == "class":
                    if attr[1].startswith("thumbcaption"):                        
                        global found_caption
                        global div_count
                        global caption_text                        
                            
                        found_caption = True
                        div_count = 0
                        caption_text = ""
                        
        
    def handle_endtag(self, tag):
        global found_caption
        if tag == "div" and found_caption:            
            global div_count            
            div_count += 1
            if div_count == 2:
                found_caption = False                
                self.append_data()
        
    def handle_data(self, data):        
        if found_caption:            
            global caption_text
            if re.search('[a-z0-9]', data, re.IGNORECASE):
                caption_text += data.split(",")[0].rstrip("'")



def SaveFile_Json(li, site, summary, images):
    save_file = os.path.join("json", li, site + ".json")    
    fp = open(save_file, "w")    

    save_obj = {}
    save_obj["name"] = site
    save_obj["category"] = li[3:]
    save_obj["summary"] = summary

    image_list = []
    a = iter(images)
    for image, caption in izip(a,a):
        image_list.append({
            "url" : image,
            "caption" : caption})
    save_obj["images"] = image_list     
    
    json.dump(save_obj, fp, ensure_ascii=False, indent=4)
    #fp.write(str(save_obj))
    fp.close()
    
    print "ADDED -- " + site
    

def Get_Page(site):
    
    baseUrl = "http://awoiaf.westeros.org/index.php/"
    url = baseUrl + str(site.replace(" ", "_"))    
    req = urllib2.Request(url, headers={'User-Agent' : "Mozilla/5.0"})
    return urllib2.urlopen(req).read().split("\n")
    
def Scrape_Images(page):
    global images_caption
    images_caption = []
    parser = MyHTMLParser()
    parser.feed(str(page))
    return images_caption

def Format_Summary(line, site):
    # Prefix every href url with "http://awoiaf.westeros.org"
    new_summ = line.replace("/index.php", "http://awoiaf.westeros.org/index.php")
    # Fix citation links
    return new_summ.replace("#cite_note", "http://awoiaf.westeros.org/index.php/" + site + "#cite_note")    

def Scrape_Summary(site, page):    

    # Beginning of patterns#
    ################################################################################
    found = 0
    if site.startswith("The"):        
        find = "<p><b>{0}</b>".format(site)
    else:        
        find = "<p><b>{0}</b>".format(site)
        
    for line in page:            
        if line.strip().startswith(find):
            found = 1
            return Format_Summary(line.strip(), site)            

    if found != 1:        
        find = "<p>{0} <b>{1}</b>".format("The", site[4:])
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        find = "<p>{0}<b> {1}</b>".format("The", site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        find = "<p>{0} <b>{1}</b>".format("The", site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        find = "<p>{0} <b>{1} </b>".format("The", site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        find = '<p><strong class="selflink">{0}</strong>'.format(site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        parse_site = site.split(" ")[0]
        find = "<p><b>{0}</b>".format(parse_site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        find = "<b>{0}</b>".format(site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    if found != 1:        
        find = '<p><b>{0}'.format(site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    # Handles House <site> of .....
    if found != 1:        
        find = '<p><b>{0}'.format(site.split(" ")[0])
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    # Handles "House Selmy" hyphenation (non-ascii) odd character ...
    if found != 1:        
        find = '<p><b>{0}'.format(site)
        for line in page:
            line_remove = "".join(i for i in line.strip() if ord(i)<128)
            if line_remove.startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    # Handles "A Holdfast" ...
    if found != 1:        
        find = '<p>{0} <b>{1}</b>'.format("A", site)
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    # Handles "Crossroads Inn" --> "Inn at the crossroads" ...
    if found != 1:        
        find = '{0}'.format("<p>The <b>inn at the crossroads</b>")
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    # Handles lowercase summary when url is sentence case, also with "The" ...
    if found != 1:        
        find = "<p>{0} <b>{1}</b>".format("The", site.lower())
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)

    # Handles lowercase summary when url is sentece case, also with "A" ...    
    if found != 1:        
        find = "<p>{0} <b>{1}</b>".format("A", site.lower())
        for line in page:            
            if line.strip().startswith(find):
                found = 1
                return Format_Summary(line.strip(), site)
            
    ################################################################################

    if found !=1:
        with open(r"errors\error_script.log", "a") as errorLog:
            errorLog.write("\n\n" + time.ctime())
            errorLog.write("\n" + site)
        print "Check Error log: " + site


def Get_SitesTxt():
    
    sites = []
    file_open = r"C:\Code\python\URLs to Castles.txt" # example file

    f = open(file_open, "r")

    for line in f:        
        split_line = line.split("/")
        temp = [split_line[len(split_line)-1].strip(), line.replace(" ", "_").strip()]
        sites.append(temp)
               
    f.close()
    return sites


def Get_SitesList():        

    lists = os.listdir("lists")
    
    for li in lists:        

        directory = os.path.join("json", li[:-5])
        if not os.path.exists(directory):
            os.makedirs(directory)
        
        f = open(os.path.join("lists", li), "r")
        values = f.read()
        sites = ast.literal_eval(values)
        for site in sites:
            save_loc = os.path.join(directory, site + ".json")            
            if not os.path.exists(save_loc):
                try:                    
                    page = Get_Page(site)
                    summary = Scrape_Summary(site, page)                
                    images = Scrape_Images(page)                
                    SaveFile_Json(li[:-5], site, summary, images)
                except:
                    print "ERROR (ex. opening page) -- " + site
            else:
                # json file exits
                # handle overwriting
                pass
              
        f.close()


def main():
    
    print "Start time: " + time.ctime()
    # Get_SitesTxt()
    Get_SitesList()                  
                
    
if __name__ == '__main__':
    
    main()
    print "done"
