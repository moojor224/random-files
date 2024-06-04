#!/bin/bash
# Bash Menu Script Example
# \033[
# 0m = reset
# 1m = bold
# 4m = underline
# 7m = inverse

# 30m = black
# 31m = red
# 32m = green
# 33m = yellow
# 34m = blue
# 35m = magenta
# 36m = cyan
# 37m = white

# 40m = black background
# 41m = red background
# 42m = green background
# 43m = yellow background
# 44m = blue background
# 45m = magenta background
# 46m = cyan background
# 47m = white background

# 90m = dark gray
# 91m = light red
# 92m = light green
# 93m = light yellow
# 94m = light blue
# 95m = light magenta
# 96m = light cyan
# 97m = white

# 100m = dark gray background
# 101m = light red background
# 102m = light green background
# 103m = light yellow background
# 104m = light blue background
# 105m = light magenta background
# 106m = light cyan background
# 107m = white background

error=$'\e[31m'
reset=$'\e[m'
yellow=$'\e[33m'
cyan=$'\e[36m'



FILES=`find "./" -type f -name "*.exe"` # find all exe files recursively
FILES="$FILES
Quit" # add quit option

options=(${FILES//$'\n'/ }) # convert to array

line="${yellow}==============================${cyan}
"
PS3="${line}${reset}Please enter your choice: "

menu() {
    printf "${line}"
    select opt in "${options[@]}"
    do
        case $opt in
            "Quit")
                break
                ;;
            *)
                if [[ $REPLY =~ ^-?[0-9]+$ ]] ;
                then
                    if (($REPLY > 0 && $REPLY <= ${#options[@]})); then
                        echo "running: $opt"
                        cmd
                        break
                    else
                        err
                        break
                    fi
                else
                    err
                    break
                fi
                ;;
        esac
    done
}

err() {
    clear
    printf "${error}${REPLY} is not a valid option.\n${reset}"
    menu
}

if [ ${#options[@]} -eq 0 ]; then # options array is empty
    echo "No executable files found"
else
    clear
    while true
    do
        clear
        menu
        if [ $opt == "Quit" ]; then
            break
        fi
    done
fi


