#!/bin/bash

# Path to this project's master pipeline script
PIPELINE_PATH="$(pwd)/main_pipeline.py"
PYTHON_PATH=$(which python3.11)

# Ensure the script is executable
chmod +x "$PIPELINE_PATH"

# Cron format for 7 AM everyday: 0 7 * * *
# We'll also log the output to pipeline.log
CRON_JOB="0 7 * * * cd $(pwd) && $PYTHON_PATH $PIPELINE_PATH >> $(pwd)/pipeline.log 2>&1"

echo "--------------------------------------------------"
echo "📅 YouTube Shorts Pipeline Scheduler"
echo "--------------------------------------------------"
echo "Proposed Cron Job:"
echo "$CRON_JOB"
echo ""
echo "To install this schedule, run the following command in your terminal:"
echo "(crontab -l 2>/dev/null; echo \"$CRON_JOB\") | crontab -"
echo ""
echo "Note: If you are in a different timezone than EST, please adjust the '0 7' part accordingly."
echo "Current system time: $(date)"
echo "--------------------------------------------------"
