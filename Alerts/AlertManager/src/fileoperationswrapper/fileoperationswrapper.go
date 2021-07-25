//  Collect : Collect, Store and Forward industrial data
//  Copyright SPIA Tech India, www.spiatech.com
//  MIT License

package fileoperationswrapper

import (
	"fmt"
	"io"
	"os"
)

//Function to create directory if not exist
func CreateDirIfNotExist(dir string) bool {
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		err = os.MkdirAll(dir, 0755)
		if err != nil {
			return false
			//panic(err)
		}
	}
	fmt.Println("Folder Created Successfully", dir)
	return true
}

//Function to create File in the path(path with file name) given as argument
func CreateFile(path string) bool {
	// check if file exists
	var _, err = os.Stat(path)

	// create file if not exists
	if os.IsNotExist(err) {
		var file, err = os.Create(path)
		if isError(err) {
			return false
		}
		defer file.Close()
	}

	fmt.Println("File Created Successfully", path)

	return true
}

//Function to write new contents to a File in the path(path with file name) given as argument
func WriteFile(path string, content string, overwrite bool) bool {
	var mode int

	if overwrite {
		mode = os.O_CREATE
	} else {
		mode = os.O_APPEND | os.O_CREATE | os.O_WRONLY
	}
	// Open file using READ & WRITE permission.
	var file, err = os.OpenFile(path, mode, 0644)
	if isError(err) {
		return false
	}
	defer file.Close()

	if overwrite{
		file.Truncate(0)
		file.Seek(0,0)
	}

	// Write some text line-by-line to file.
	_, err = file.WriteString(content)
	if isError(err) {
		return false
	}

	// Save file changes.
	err = file.Sync()
	if isError(err) {
		return false
	}

	fmt.Println("File Updated Successfully.")
	return true
}

//Function to read contents in a File in the path(path with file name) given as argument
//Will return content if successfull
//Will return empty if failed
func ReadFile(path string) string {

	// Open file for reading.
	var file, err = os.OpenFile(path, os.O_RDWR, 0644)
	if isError(err) {
		return ""
	}
	defer file.Close()

	fileinfo, err := file.Stat()
	if err != nil {
		fmt.Println(err)
		return ""
	}

	filesize := fileinfo.Size()

	// Read file, line by line
	var text = make([]byte, filesize)
	for {
		_, err = file.Read(text)

		// Break if finally arrived at end of file
		if err == io.EOF {
			break
		}

		// Break if error occured
		if err != nil && err != io.EOF {
			isError(err)
			break
		}
	}

	fmt.Println("Reading from file.")
	fmt.Println(string(text))
	fmt.Println("End of File content")
	return string(text)
}

//Function to delete a File in the path(path with file name) given as argument
func DeleteFile(path string) bool {
	// delete file
	var err = os.Remove(path)
	if isError(err) {
		return false
	}

	fmt.Println("File Deleted")
	return true
}

//Function to check if error and print error details
func isError(err error) bool {
	if err != nil {
		fmt.Println(err.Error())
	}

	return (err != nil)
}
