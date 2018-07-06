#! /bin/bash
# . /usr/local/bin/virtualenvwrapper.sh
cd /vagrant/python-envs/yzy_project
source bin/activate
# workon yzy_project
cd /vagrant/hotstory/worker && python crawler.py